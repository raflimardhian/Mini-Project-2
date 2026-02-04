require('dotenv').config()
const amqp = require('amqplib');

let channel;

async function connect() {
    if (channel) return channel;
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        console.log('RabbitMQ Producer Channel Created');
        return channel;
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
}

async function publishToQueue(queueName, data) {
    if (!channel) await connect();
    try {
        await channel.assertQueue(queueName, { durable: true }); 
        
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
            persistent: true 
        });
        
        console.log(`[Queue] Message sent to ${queueName}:`, data);
    } catch (error) {
        console.error(`[Queue] Failed to send message to ${queueName}:`, error);
    }
}

module.exports = { publishToQueue };