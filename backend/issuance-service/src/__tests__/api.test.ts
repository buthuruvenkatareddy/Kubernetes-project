import request from 'supertest';
import { CredentialDatabase } from '../database';

// Set test environment
process.env.WORKER_ID = 'worker-test';
process.env.NODE_ENV = 'test';

// Mock the database
jest.mock('../database');

const mockDb = {
  getWorkerId: jest.fn().mockReturnValue('worker-test'),
  issueCredential: jest.fn(),
  getCredential: jest.fn(),
  close: jest.fn()
};

// Mock the database constructor
(CredentialDatabase as jest.MockedClass<typeof CredentialDatabase>).mockImplementation(() => mockDb as any);

// Import app after mocking
import app from '../index';

describe('Issuance Service API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Issuance service is healthy');
      expect(response.body.data.workerId).toBe('worker-test');
    });
  });

  describe('POST /api/credentials/issue', () => {
    const validCredential = {
      holderName: 'John Doe',
      issuerName: 'University of Test',
      credentialType: 'Bachelor\'s Degree',
      issuanceDate: '2023-06-15T00:00:00.000Z',
      attributes: {
        degree: 'Computer Science',
        gpa: '3.8'
      }
    };

    it('should issue a new credential successfully', async () => {
      const issuedCredential = {
        ...validCredential,
        id: 'test-uuid',
        workerId: 'worker-test',
        timestamp: '2023-07-01T10:00:00.000Z'
      };

      mockDb.issueCredential.mockResolvedValue(issuedCredential);

      const response = await request(app)
        .post('/api/credentials/issue')
        .send(validCredential);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('credential issued by worker-test');
      expect(response.body.data).toEqual(issuedCredential);
    });

    it('should return 400 for invalid credential data', async () => {
      const invalidCredential = {
        holderName: '',
        issuerName: 'University of Test'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/credentials/issue')
        .send(invalidCredential);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credential data');
    });

    it('should return 409 when credential already exists', async () => {
      mockDb.issueCredential.mockRejectedValue(new Error('Credential already issued'));

      const response = await request(app)
        .post('/api/credentials/issue')
        .send(validCredential);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credential already issued');
    });
  });

  describe('GET /api/credentials/:id', () => {
    it('should retrieve credential by ID', async () => {
      const credential = {
        id: 'test-uuid',
        holderName: 'John Doe',
        issuerName: 'University of Test',
        credentialType: 'Bachelor\'s Degree',
        issuanceDate: '2023-06-15T00:00:00.000Z',
        attributes: { degree: 'Computer Science' },
        workerId: 'worker-test',
        timestamp: '2023-07-01T10:00:00.000Z'
      };

      mockDb.getCredential.mockResolvedValue(credential);

      const response = await request(app).get('/api/credentials/test-uuid');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(credential);
    });

    it('should return 404 for non-existent credential', async () => {
      mockDb.getCredential.mockResolvedValue(null);

      const response = await request(app).get('/api/credentials/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credential not found');
    });
  });
});