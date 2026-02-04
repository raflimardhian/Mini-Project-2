const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


function createSecurity() {
    const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_123';

    return {
        async hashPassword(password) {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        },

        async verifyPassword(password, hash) {
        // TODO 2.2: Use bcrypt to compare password and hash
            return await bcrypt.compare(password, hash);
        },

        generateAccessToken(payload) {
        // TODO 2.3: Generate a JWT token
            return jwt.sign(payload, SECRET_KEY, { expiresIn:'1h' });
        },

        generateRefreshToken(payload) {
        // TODO 3.1: Generate Refresh Token
            return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
        },

        verifyToken(token) {
        // TODO 2.4: Verify the JWT token
            try {
                return jwt.verify(token, SECRET_KEY);
            } catch (error) {
                return null;
            }
        }
    };
}

module.exports = createSecurity