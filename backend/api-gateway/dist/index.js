"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const interviews_1 = __importDefault(require("./routes/interviews"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'api-gateway' });
});
const auth_1 = __importDefault(require("./routes/auth"));
// Placeholder for future routes
app.use('/api/auth', auth_1.default);
app.use('/api/interviews', interviews_1.default);
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
