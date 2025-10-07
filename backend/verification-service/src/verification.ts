import axios from 'axios';
import { IssuedCredential, VerificationResult } from './types';

export class VerificationService {
  private workerId: string;
  private issuanceServiceUrl: string;

  constructor() {
    this.workerId = process.env.WORKER_ID || `verifier-${Math.floor(Math.random() * 1000)}`;
    this.issuanceServiceUrl = process.env.ISSUANCE_SERVICE_URL || 'http://localhost:3001';
  }

  async verifyCredential(credentialId: string): Promise<VerificationResult> {
    try {
      // Call the issuance service to get credential details
      const response = await axios.get(
        `${this.issuanceServiceUrl}/api/credentials/${credentialId}`,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 && response.data.success) {
        const credential: IssuedCredential = response.data.data;
        
        // Additional verification logic can be added here
        // For now, we verify based on existence and expiration
        const isExpired = credential.expirationDate ? 
          new Date(credential.expirationDate) < new Date() : false;

        if (isExpired) {
          return {
            isValid: false,
            credential,
            verifiedBy: this.workerId,
            verificationTimestamp: new Date().toISOString()
          };
        }

        return {
          isValid: true,
          credential,
          workerId: credential.workerId,
          timestamp: credential.timestamp,
          verifiedBy: this.workerId,
          verificationTimestamp: new Date().toISOString()
        };
      }

      // Credential not found
      return {
        isValid: false,
        verifiedBy: this.workerId,
        verificationTimestamp: new Date().toISOString()
      };

    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          isValid: false,
          verifiedBy: this.workerId,
          verificationTimestamp: new Date().toISOString()
        };
      }

      throw new Error(`Verification failed: ${error.message}`);
    }
  }

  getWorkerId(): string {
    return this.workerId;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.issuanceServiceUrl}/health`, {
        timeout: 3000
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}