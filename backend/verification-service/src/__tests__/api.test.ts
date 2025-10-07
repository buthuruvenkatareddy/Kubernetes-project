import request from 'supertest';
import { VerificationService } from '../verification';

// Set test environment
process.env.WORKER_ID = 'verifier-test';
process.env.NODE_ENV = 'test';

// Mock the verification service
jest.mock('../verification');

const mockVerificationService = {
  getWorkerId: jest.fn().mockReturnValue('verifier-test'),
  healthCheck: jest.fn().mockResolvedValue(true),
  verifyCredential: jest.fn()
};

// Mock the VerificationService constructor
(VerificationService as jest.MockedClass<typeof VerificationService>).mockImplementation(() => mockVerificationService as any);

// Import app after mocking
import app from '../index';

describe('Verification Service API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Verification service is healthy');
      expect(response.body.data.workerId).toBe('verifier-test');
    });
  });

  describe('POST /api/credentials/verify', () => {
    const verificationRequest = {
      credentialId: '123e4567-e89b-12d3-a456-426614174000'
    };

    it('should verify a valid credential', async () => {
      const verificationResult = {
        isValid: true,
        credential: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          holderName: 'John Doe',
          issuerName: 'University of Test',
          credentialType: 'Bachelor\'s Degree',
          issuanceDate: '2023-06-15T00:00:00.000Z',
          attributes: { degree: 'Computer Science' },
          workerId: 'worker-1',
          timestamp: '2023-07-01T10:00:00.000Z'
        },
        workerId: 'worker-1',
        timestamp: '2023-07-01T10:00:00.000Z',
        verifiedBy: 'verifier-test',
        verificationTimestamp: '2023-07-01T11:00:00.000Z'
      };

      mockVerificationService.verifyCredential.mockResolvedValue(verificationResult);

      const response = await request(app)
        .post('/api/credentials/verify')
        .send(verificationRequest);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('credential verified by verifier-test');
      expect(response.body.data).toEqual(verificationResult);
    });

    it('should return 404 for invalid credential', async () => {
      const verificationResult = {
        isValid: false,
        verifiedBy: 'verifier-test',
        verificationTimestamp: '2023-07-01T11:00:00.000Z'
      };

      mockVerificationService.verifyCredential.mockResolvedValue(verificationResult);

      const response = await request(app)
        .post('/api/credentials/verify')
        .send(verificationRequest);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credential not found or invalid');
    });

    it('should return 400 for invalid request format', async () => {
      const invalidRequest = {
        credentialId: 'invalid-uuid'
      };

      const response = await request(app)
        .post('/api/credentials/verify')
        .send(invalidRequest);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid verification request');
    });
  });

  describe('GET /api/credentials/verify/:id', () => {
    it('should verify credential by ID in URL', async () => {
      const verificationResult = {
        isValid: true,
        credential: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          holderName: 'John Doe',
          issuerName: 'University of Test',
          credentialType: 'Bachelor\'s Degree',
          issuanceDate: '2023-06-15T00:00:00.000Z',
          attributes: { degree: 'Computer Science' },
          workerId: 'worker-1',
          timestamp: '2023-07-01T10:00:00.000Z'
        },
        workerId: 'worker-1',
        timestamp: '2023-07-01T10:00:00.000Z',
        verifiedBy: 'verifier-test',
        verificationTimestamp: '2023-07-01T11:00:00.000Z'
      };

      mockVerificationService.verifyCredential.mockResolvedValue(verificationResult);

      const response = await request(app)
        .get('/api/credentials/verify/123e4567-e89b-12d3-a456-426614174000');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(verificationResult);
    });
  });
});