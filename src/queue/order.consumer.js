require('dotenv').config()
const amqp = require('amqplib');
const prisma = require('../db');
const nodemailer = require('../utils/mailer')

const QUEUE_NAME = 'order_payment';

async function startOrderWorker() {
    try {
        console.log('Order Worker connecting to RabbitMQ...');
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = await connection.createChannel();
        
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`Worker waiting for messages in '${QUEUE_NAME}'...`);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                console.log("Data diterima Worker:", content);
                const { orderId, resellerId, owner, emailBuyer, resellerCommission, ownerCommission } = content;

                try {
                    console.log(`[Worker] Processing Commission for Order ID: ${orderId}`);

                    await prisma.$transaction(async (tx) => {
                        await tx.user.update({
                            where: { id: resellerId },
                            data: {
                                balanceCommission: { increment: resellerCommission }
                            }
                        });

                        await tx.user.update({
                            where:{
                                id:owner
                            },
                            data:{
                                balanceCommission:{ increment:ownerCommission}
                            }
                        })
                        // const updateLog = await tx.commissionLog.updateMany({
                        //     where: { 
                        //         orderId: Number(orderId), 
                        //         type: 'PENDING' 
                        //     },
                        //     data: { type: 'EARNED' }
                        // });
                        await tx.commissionLog.updateMany({
                            where: { 
                                orderId,
                                type: "PENDING" 
                            },
                            data: {
                                type: "EARNED" 
                            }
                        });
                        // if (updateLog.count > 0) {
                        //     await tx.user.update({
                        //         where: { id: resellerId },
                        //         data: {
                        //             balanceCommission: { increment: Number(commission) }
                        //         }
                        //     });
                        //     console.log(`[Worker] Sukses: Saldo Reseller ${resellerId} bertambah.`);
                        // } else {
                        //     console.log(`[Worker] Skip: Komisi Order ${orderId} sudah pernah diproses sebelumnya.`);
                        // }
                    });
                    await nodemailer.sendEmail(emailBuyer, "Email Payment Confirmation", "Selamat pembayaran anda success")

                    console.log(`[Worker] Success: Order ${orderId} PAID & Balance Updated.`);
                    channel.ack(msg); // Konfirmasi pesan selesai diproses

                } catch (err) {
                    console.error('[Worker] Error processing commission:', err.message);
                    channel.nack(msg, false, true)
                }
            }
        });

    } catch (error) {
        console.error('Order Worker failed to start:', error);
    }
}

startOrderWorker();

module.exports = { startOrderWorker };