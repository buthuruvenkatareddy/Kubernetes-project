import { validateCredential } from '../validation';

describe('Credential Validation', () => {
  describe('validateCredential', () => {
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

    it('should validate a correct credential', () => {
      const { error, value } = validateCredential(validCredential);
      
      expect(error).toBeUndefined();
      expect(value).toEqual(validCredential);
    });

    it('should reject credential with missing holderName', () => {
      const invalidCredential = { ...validCredential };
      delete (invalidCredential as any).holderName;

      const { error } = validateCredential(invalidCredential);
      
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('holderName');
    });

    it('should reject credential with invalid date format', () => {
      const invalidCredential = {
        ...validCredential,
        issuanceDate: 'invalid-date'
      };

      const { error } = validateCredential(invalidCredential);
      
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('issuanceDate');
    });

    it('should reject credential with empty holderName', () => {
      const invalidCredential = {
        ...validCredential,
        holderName: ''
      };

      const { error } = validateCredential(invalidCredential);
      
      expect(error).toBeDefined();
    });

    it('should accept credential with optional expirationDate', () => {
      const credentialWithExpiration = {
        ...validCredential,
        expirationDate: '2027-06-15T00:00:00.000Z'
      };

      const { error, value } = validateCredential(credentialWithExpiration);
      
      expect(error).toBeUndefined();
      expect(value).toEqual(credentialWithExpiration);
    });
  });
});