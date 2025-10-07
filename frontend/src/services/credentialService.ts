import axios from 'axios';
import { Credential, IssuedCredential, VerificationResult, ApiResponse } from '../types';

const ISSUANCE_API_URL = process.env.REACT_APP_ISSUANCE_API_URL || 'http://localhost:3001';
const VERIFICATION_API_URL = process.env.REACT_APP_VERIFICATION_API_URL || 'http://localhost:3002';

// Create axios instances with default configuration
const issuanceApi = axios.create({
  baseURL: ISSUANCE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const verificationApi = axios.create({
  baseURL: VERIFICATION_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class CredentialService {
  // Issue a new credential
  static async issueCredential(credential: Credential): Promise<IssuedCredential> {
    try {
      const response = await issuanceApi.post<ApiResponse<IssuedCredential>>(
        '/api/credentials/issue',
        credential
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to issue credential');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error: Unable to issue credential');
    }
  }

  // Get credential by ID
  static async getCredential(id: string): Promise<IssuedCredential> {
    try {
      const response = await issuanceApi.get<ApiResponse<IssuedCredential>>(
        `/api/credentials/${id}`
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Credential not found');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error: Unable to fetch credential');
    }
  }

  // Verify a credential
  static async verifyCredential(credentialId: string): Promise<VerificationResult> {
    try {
      const response = await verificationApi.post<ApiResponse<VerificationResult>>(
        '/api/credentials/verify',
        { credentialId }
      );
      
      if (response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Verification failed');
    } catch (error: any) {
      if (error.response?.data?.data) {
        return error.response.data.data;
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error: Unable to verify credential');
    }
  }

  // Health check for issuance service
  static async checkIssuanceHealth(): Promise<boolean> {
    try {
      const response = await issuanceApi.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // Health check for verification service
  static async checkVerificationHealth(): Promise<boolean> {
    try {
      const response = await verificationApi.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}