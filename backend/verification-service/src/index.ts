import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { VerificationService } from './verification';
import { validateVerificationRequest } from './validation';
import { ApiResponse, VerificationRequest } from './types';

const app = express();
const PORT = process.env.PORT || 3002;
const verificationService = new VerificationService();

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
app.get('/health', async (req: Request, res: Response) => {
  const issuanceServiceHealthy = await verificationService.healthCheck();
  
  res.json({
    success: true,
    message: 'Verification service is healthy',
    data: {
      workerId: verificationService.getWorkerId(),
      timestamp: new Date().toISOString(),
      issuanceServiceConnected: issuanceServiceHealthy
    }
  } as ApiResponse);
});

// Verify credential endpoint
app.post('/api/credentials/verify', async (req: Request, res: Response) => {
  try {
    const { error, value } = validateVerificationRequest(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification request',
        error: error.details[0].message
      } as ApiResponse);
    }

    const { credentialId }: VerificationRequest = value;
    const result = await verificationService.verifyCredential(credentialId);

    if (result.isValid) {
      res.json({
        success: true,
        message: `credential verified by ${result.verifiedBy}`,
        data: result
      } as ApiResponse);
    } else {
      res.status(404).json({
        success: false,
        message: 'Credential not found or invalid',
        data: result
      } as ApiResponse);
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    } as ApiResponse);
  }
});

// Verify credential by ID in URL
app.get('/api/credentials/verify/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Credential ID is required'
      } as ApiResponse);
    }

    const result = await verificationService.verifyCredential(id);

    if (result.isValid) {
      res.json({
        success: true,
        message: `credential verified by ${result.verifiedBy}`,
        data: result
      } as ApiResponse);
    } else {
      res.status(404).json({
        success: false,
        message: 'Credential not found or invalid',
        data: result
      } as ApiResponse);
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    } as ApiResponse);
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Verification service running on port ${PORT}`);
  console.log(`Worker ID: ${verificationService.getWorkerId()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

export default app;