"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_hireq';
// --- POST /api/auth/register ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const existingCompany = await prisma_1.default.company.findUnique({
            where: { email }
        });
        if (existingCompany) {
            return res.status(400).json({ success: false, error: 'Company with this email already exists' });
        }
        const password_hash = await bcrypt_1.default.hash(password, 10);
        const newCompany = await prisma_1.default.company.create({
            data: {
                name,
                email,
                password_hash
            }
        });
        const token = jsonwebtoken_1.default.sign({ companyId: newCompany.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            token,
            company: {
                id: newCompany.id,
                name: newCompany.name,
                email: newCompany.email
            }
        });
    }
    catch (error) {
        console.error('Error registering company:', error);
        res.status(500).json({ success: false, error: 'Failed to register company' });
    }
});
// --- POST /api/auth/login ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const company = await prisma_1.default.company.findUnique({
            where: { email }
        });
        if (!company) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt_1.default.compare(password, company.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ companyId: company.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            token,
            company: {
                id: company.id,
                name: company.name,
                email: company.email
            }
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: 'Failed to log in' });
    }
});
exports.default = router;
