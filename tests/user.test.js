const { describe, it, expect, beforeAll, afterAll, beforeEach, mock } = require('bun:test');

const { mockUser,prismaMock, resetMocks } = require('./mocks/prisma');


mock.module('../src/db.js', () => ({
    // prisma: {
    //     user: mockUser
    // }
    user: mockUser,
    product: { findMany: mock(() => []) }, 
    order: { findMany: mock(() => []) }
}));
const app = require('../src/index.js');
const createSecurity = require('../src/utils/security.js');
const security = createSecurity();
const { generateAccessToken } = security;

let server;
const BASE_URL = 'http://localhost:3002';
const mockUsers = [
    { id: 1, username: 'sayaUser', password: 'saya123', role: 'user' },
    { id: 2, username: 'sayaAdmin', password: 'saya123', role: 'admin' }
];

const validToken = generateAccessToken({ id: 1, username: 'sayaUser', role:'ADMIN' });

beforeAll(() => {
    server = app.listen(3002);
});

afterAll(() => {
    server.close();
});

beforeEach(() => {
    resetMocks();
});

describe('User API', () => {
    describe('GET /user', () => {
        it('should return all users with success status', async () => {
            mockUser.findMany.mockReturnValue(mockUsers);
            
            const response = await fetch(`${BASE_URL}/users`,
                {
                headers: { 'Authorization': `Bearer ${validToken}` }
            }
            );
            const data = await response.json();
            
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.user).toHaveLength(2);
            expect(mockUser.findMany).toHaveBeenCalled();
        });
    });
    describe('GET /users/:id', () => {
        it('should return a user by id', async () => {
            const mockSingleUser = { id: 1, username: 'rafli', role: 'user' };
            mockUser.findUnique.mockReturnValue(mockSingleUser);

            const response = await fetch(`${BASE_URL}/users/1`, {
                headers: { 'Authorization': `Bearer ${validToken}` }
            });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.user.username).toBe('rafli');
        });

        it('should return 404 if user not found', async () => {
            mockUser.findUnique.mockReturnValue(null);

            const response = await fetch(`${BASE_URL}/users/999`, {
                headers: { 'Authorization': `Bearer ${validToken}` }
            });
            
            expect(response.status).toBe(404);
        });
    });
    describe('POST /users', () => {
        it('should create a new user successfully', async () => {
            const newUser = { username: 'newUser', password: 'password123'};
            const createdUser = { id: 3, ...newUser };
            
            mockUser.create.mockReturnValue(createdUser);

            const response = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${validToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.user.id).toBe(3);
        });
    });
    describe('DELETE /users/:id', () => {
        it('should delete a user successfully', async () => {
            const userToDelete = { id: 1, username: 'deletedUser' };
            // Service Anda cek findById dulu sebelum delete
            mockUser.findUnique.mockReturnValue(userToDelete);
            mockUser.delete.mockReturnValue(userToDelete);

            const response = await fetch(`${BASE_URL}/users/1`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${validToken}` }
            });
            const data = await response.json();

            // Sesuai controller Anda: res.status(201)
            expect(response.status).toBe(200); 
            expect(data.success).toBe(true);
            expect(data.message).toBe("User deleted successfully");
        });
    });

    // ... (Test case lainnya tetap sama, hanya pastikan menggunakan async/await di dalam block 'it')
});