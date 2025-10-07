import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { CredentialDatabase } from './database';
import { validateCredential } from './validation';
import { ApiResponse, Credential } from './types';

const app = express();
const PORT = process.env.PORT || 3001;
const db = new CredentialDatabase();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  } as ApiResponse);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Issuance service is healthy',
    data: {
      workerId: db.getWorkerId(),
      timestamp: new Date().toISOString()
    }
  } as ApiResponse);
});

// Issue credential endpoint
app.post('/api/credentials/issue', async (req: Request, res: Response) => {
  try {
    const { error, value } = validateCredential(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credential data',
        error: error.details[0].message
      } as ApiResponse);
    }

    const credential: Credential = value;
    const issuedCredential = await db.issueCredential(credential);

    res.status(201).json({
      success: true,
      message: `credential issued by ${issuedCredential.workerId}`,
      data: issuedCredential
    } as ApiResponse);

  } catch (error: any) {
    if (error.message === 'Credential already issued') {
      return res.status(409).json({
        success: false,
        message: 'Credential already issued',
        error: error.message
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to issue credential',
      error: error.message
    } as ApiResponse);
  }
});

// Get credential endpoint
app.get('/api/credentials/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const credential = await db.getCredential(id);

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Credential retrieved successfully',
      data: credential
    } as ApiResponse);

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve credential',
      error: error.message
    } as ApiResponse);
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Issuance service running on port ${PORT}`);
  console.log(`Worker ID: ${db.getWorkerId()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    db.close();
    process.exit(0);
  });
});

export default app;