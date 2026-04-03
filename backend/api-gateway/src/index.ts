import express, { Request, Response } from 'express';
import cors from 'cors';
import interviewRoutes from './routes/interviews';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'api-gateway' });
});

import authRoutes from './routes/auth';

// Placeholder for future routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
