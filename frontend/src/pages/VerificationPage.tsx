import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { VerifiedUser, Search, CheckCircle, Cancel } from '@mui/icons-material';
import { CredentialService } from '../services/credentialService';
import { VerificationResult } from '../types';

const VerificationPage: React.FC = () => {
  const [credentialId, setCredentialId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialId.trim()) {
      setError('Please enter a credential ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const verificationResult = await CredentialService.verifyCredential(credentialId.trim());
      setResult(verificationResult);
    } catch (err: any) {
      setError(err.message || 'Failed to verify credential');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCredentialId('');
    setError(null);
    setResult(null);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <VerifiedUser sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Verify Credential
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: '1 1 300px' }}
              label="Credential ID"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              disabled={loading}
              placeholder="Enter the credential ID to verify"
              helperText="Enter the unique identifier of the credential you want to verify"
            />
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>

        {result && (
          <Card 
            sx={{ 
              bgcolor: result.isValid ? 'success.light' : 'error.light',
              color: result.isValid ? 'success.contrastText' : 'error.contrastText'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {result.isValid ? (
                  <CheckCircle sx={{ mr: 1, fontSize: 28 }} />
                ) : (
                  <Cancel sx={{ mr: 1, fontSize: 28 }} />
                )}
                <Typography variant="h5">
                  {result.isValid ? 'Credential Valid' : 'Credential Invalid'}
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                <Typography variant="body2">
                  <strong>Verified by:</strong> {result.verifiedBy}
                </Typography>
                <Typography variant="body2">
                  <strong>Verification Time:</strong> {new Date(result.verificationTimestamp).toLocaleString()}
                </Typography>
              </Box>

              {result.isValid && result.credential && (
                <>
                  <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Credential Details:
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                    <Typography variant="body2">
                      <strong>Holder:</strong> {result.credential.holderName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Issuer:</strong> {result.credential.issuerName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {result.credential.credentialType}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Issued by Worker:</strong> {result.credential.workerId}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Issuance Date:</strong> {new Date(result.credential.issuanceDate).toLocaleDateString()}
                    </Typography>
                    {result.credential.expirationDate && (
                      <Typography variant="body2">
                        <strong>Expiration Date:</strong> {new Date(result.credential.expirationDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>

                  {result.credential.attributes && Object.keys(result.credential.attributes).length > 0 && (
                    <>
                      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        Attributes:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(result.credential.attributes).map(([key, value]) => (
                          <Chip
                            key={key}
                            label={`${key}: ${value}`}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.2)', 
                              color: 'inherit',
                              borderColor: 'rgba(255,255,255,0.5)'
                            }}
                          />
                        ))}
                      </Box>
                    </>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={`Originally issued at: ${new Date(result.credential.timestamp).toLocaleString()}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'inherit',
                        borderColor: 'rgba(255,255,255,0.5)'
                      }}
                    />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {!result && !loading && !error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Enter a credential ID above to verify its authenticity and view details.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VerificationPage;