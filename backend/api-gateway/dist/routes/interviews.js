"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// --- 1. GET /api/interviews (List Company Interviews) ---
router.get('/', auth_1.authenticateCompany, async (req, res) => {
    try {
        const companyId = req.companyId;
        if (!companyId)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        const interviews = await prisma_1.default.interview.findMany({
            where: { company_id: companyId },
            orderBy: { created_at: 'desc' },
            include: {
                _count: { select: { sessions: true } }
            }
        });
        // Formatting for the frontend Dashboard
        const formatted = interviews.map(inv => ({
            id: inv.interview_code, // Use OTP as the "ID" displaying on UI
            role: inv.title,
            candidates: inv._count.sessions,
            status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
            created: inv.created_at.toISOString(),
            rawId: inv.id // keep raw UUID just in case
        }));
        res.json({ success: true, interviews: formatted });
    }
    catch (error) {
        console.error('Error fetching interviews:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch interviews' });
    }
});
// --- 2. POST /api/interviews/create (Generate OTP) ---
router.post('/create', auth_1.authenticateCompany, async (req, res) => {
    try {
        const { title, description, duration, stack, instructions } = req.body;
        const companyId = req.companyId;
        if (!companyId)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        // Generate a secure 6 character OTP
        const generateOTP = () => Math.random().toString(36).substring(2, 8).toUpperCase();
        let otp = generateOTP();
        let isUnique = false;
        // Ensure OTP is truly unique in the database
        while (!isUnique) {
            const existing = await prisma_1.default.interview.findUnique({ where: { interview_code: otp } });
            if (!existing)
                isUnique = true;
            else
                otp = generateOTP();
        }
        const newInterview = await prisma_1.default.interview.create({
            data: {
                company_id: companyId,
                title,
                job_description: description ? `${description}\n\nInstructions: ${instructions || 'None'}\nDuration: ${duration} Minutes` : 'No description provided.',
                description: stack || '',
                interview_code: otp,
                status: 'active'
            }
        });
        res.json({
            success: true,
            data: {
                id: newInterview.interview_code,
                role: newInterview.title,
                candidates: 0,
                status: 'Active',
                created: newInterview.created_at.toISOString()
            }
        });
    }
    catch (error) {
        console.error('Error creating interview:', error);
        res.status(500).json({ success: false, error: 'Failed to create interview' });
    }
});
// --- 3. POST /api/interviews/join (Validate OTP & Create Candidate Session) ---
router.post('/join', async (req, res) => {
    try {
        const { code, name, email } = req.body;
        if (!code || !name || !email) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        // Validate the OTP
        const interview = await prisma_1.default.interview.findUnique({
            where: { interview_code: code.toUpperCase() }
        });
        if (!interview) {
            return res.status(404).json({ success: false, error: 'Invalid interview code' });
        }
        // Create Candidate Session
        const session = await prisma_1.default.interviewSession.create({
            data: {
                interview_id: interview.id,
                candidate_name: name,
                candidate_email: email,
                status: 'waiting'
            }
        });
        res.json({
            success: true,
            sessionId: session.id,
            interviewTitle: interview.title
        });
    }
    catch (error) {
        console.error('Error joining interview:', error);
        res.status(500).json({ success: false, error: 'Failed to join interview' });
    }
});
// --- 4. GET /api/interviews/session/:sessionId (Fetch Candidate Session Details) ---
router.get('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await prisma_1.default.interviewSession.findUnique({
            where: { id: sessionId },
            include: {
                interview: {
                    include: { company: true }
                }
            }
        });
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }
        res.json({
            success: true,
            data: {
                candidateName: session.candidate_name,
                role: session.interview.title,
                companyName: session.interview.company.name,
                status: session.status
            }
        });
    }
    catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch session' });
    }
});
exports.default = router;
