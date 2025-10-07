export interface Credential {
  id: string;
  holderName: string;
  issuerName: string;
  credentialType: string;
  issuanceDate: string;
  expirationDate?: string;
  attributes: Record<string, any>;
}

export interface IssuedCredential extends Credential {
  workerId: string;
  timestamp: string;
}

export interface VerificationRequest {
  credentialId: string;
}

export interface VerificationResult {
  isValid: boolean;
  credential?: IssuedCredential;
  workerId?: string;
  timestamp?: string;
  verifiedBy: string;
  verificationTimestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}