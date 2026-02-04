const { describe, it, expect, beforeAll, afterAll, beforeEach, mock } = require('bun:test');
const { mockProduct, prismaMock, resetMocks } = require('./mocks/prisma');

mock.module('../src/db.js', () => prismaMock);

const app = require('../src/index.js');
const createSecurity = require('../src/utils/security.js');
const { generateAccessToken } = createSecurity();

const BASE_URL = 'http://localhost:3002';
let server;

// Token admin untuk otorisasi
const validToken = generateAccessToken({ id: 1, username: 'admin', role: 'ADMIN' });

beforeAll(() => {
    server = app.listen(3002);
});

afterAll(() => {
    server.close();
});

beforeEach(() => {
    resetMocks();
    // Pastikan repository findById tersedia di mock
    if (!mockProduct.findUnique) mockProduct.findUnique = mock();
});

describe('Product API', () => {

    describe('GET /product', () => {
        it('should return all products', async () => {
            mockProduct.findMany.mockReturnValue([
                { id: 1, name: 'Kopi', basePrice: 15000, stock: 10 },
                { id: 2, name: 'Teh', basePrice: 5000, stock: 20 }
            ]);

            const response = await fetch(`${BASE_URL}/product`,
                {
                headers: { 'Authorization': `Bearer ${validToken}` }
            }
            );
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.product).toHaveLength(2);
        });
    });

    describe('POST /product', () => {
        const newProduct = {
            ownerId: 1,
            name: 'Susu Segar',
            basePrice: 12000,
            stock: 50
        };

        it('should create product successfully', async () => {
            mockProduct.create.mockReturnValue({ id: 3, ...newProduct, ownerId: 1 });

            const response = await fetch(`${BASE_URL}/product`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${validToken}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(newProduct)
            });

            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.product.name).toBe('Susu Segar');
        });

        it('should fail if basePrice is 0 or less', async () => {
            const response = await fetch(`${BASE_URL}/product`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${validToken}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ ...newProduct, basePrice: 0 })
            });

            expect(response.status).toBe(400); // INVALID_VALUE di service
        });
    });

    describe('GET /product/:id', () => {
        it('should return 404 if product not found', async () => {
            // Mock findById mengembalikan null
            mockProduct.findUnique.mockReturnValue(null);

            const response = await fetch(`${BASE_URL}/product/999`,
                {
                headers: { 'Authorization': `Bearer ${validToken}` }
            }
            );
        });
    });

    describe('UPDATE /product/:id', () => {
        it('should update product successfully', async () => {
            const existingProduct = { id: 1, name: 'Kopi', basePrice: 15000, stock: 10 };
            mockProduct.findUnique.mockReturnValue(existingProduct);
            mockProduct.update.mockReturnValue({ ...existingProduct, name: 'Kopi Hitam' });

            const response = await fetch(`${BASE_URL}/product/1`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${validToken}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ name: 'Kopi Hitam' })
            });

            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.product.name).toBe('Kopi Hitam');
        });
    });

    describe('DELETE /product/:id', () => {
        it('should delete product successfully', async () => {
            const productToDelete = { id: 1, name: 'Kopi' };
            
            // Logika service Anda: delete dulu baru cek findById (agak unik kodenya)
            mockProduct.delete.mockReturnValue(productToDelete);
            mockProduct.findUnique.mockReturnValue(productToDelete); 

            const response = await fetch(`${BASE_URL}/product/1`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${validToken}` }
            });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.message).toBe("Deleted successfully");
        });
    });
});