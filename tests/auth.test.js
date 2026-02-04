const { describe, it, expect, beforeAll, afterAll, beforeEach, mock } = require('bun:test');
const { mockUser, prismaMock, resetMocks } = require('./mocks/prisma');
const bcrypt = require('bcrypt');
mock.module('../src/db.js', () => prismaMock);

const app = require('../src/index.js');
const BASE_URL = 'http://localhost:3002';
let server;

beforeAll(() => {
    server = app.listen(3002);
});

afterAll(() => {
    server.close();
});

beforeEach(() => {
    resetMocks();
    if (!mockUser.findByUsername) {
        mockUser.findByUsername = mock();
    }
});

describe('Auth API', () => {
    
    describe('POST /auth/register', () => {
        const registrationData = {
            username: 'userBaru',
            password: 'password123',
        };

        it('should register a new user successfully', async () => {
            mockUser.findByUsername.mockReturnValue(null);
            mockUser.create.mockReturnValue({ id: 10, username: 'userBaru' });

            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });

            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.success).toBe(true);
            expect(data.user.username).toBe('userBaru');
        });

        it('should fail if username already exists', async () => {
            mockUser.findUnique.mockReturnValue({ id: 1, username: 'userBaru' });

            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });

            expect(response.status).toBe(409);
        });
    });

    describe('POST /auth/login', () => {
        const loginCredentials = {
            username: 'userAktif',
            password: 'passwordBenar'
        };

        it('should login successfully and return a token', async () => {
            const validHash = await bcrypt.hash('passwordBenar', 10);
            mockUser.findUnique.mockReturnValue({
                username: 'userAktif',
                password: validHash, 
            });

            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginCredentials)
            });

            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.user.user.username).toBe('userAktif');
        });

        it('should return 404 if user not found', async () => {
            mockUser.findByUsername.mockReturnValue(null);

            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'tidakAda', password: 'password' })
            });

            expect(response.status).toBe(404);
        });
    });
});