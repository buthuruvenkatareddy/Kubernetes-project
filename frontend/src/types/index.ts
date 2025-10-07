export interface Credential {
  id?: string;
  holderName: string;
  issuerName: string;
  credentialType: string;
  issuanceDate: string;
  expirationDate?: string;
  attributes: Record<string, any>;
}

export interface IssuedCredential extends Credential {
  id: string;
  workerId: string;
  timestamp: string;
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

export interface CredentialFormData {
  holderName: string;
  issuerName: string;
  credentialType: string;
  issuanceDate: string;
  expirationDate: string;
  degree: string;
  gpa: string;
  institution: string;
  additionalAttributes: string;
}