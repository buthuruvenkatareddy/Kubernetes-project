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
  Chip
} from '@mui/material';
import { CreateOutlined, CheckCircle } from '@mui/icons-material';
import { CredentialService } from '../services/credentialService';
import { CredentialFormData, IssuedCredential } from '../types';

const IssuancePage: React.FC = () => {
  const [formData, setFormData] = useState<CredentialFormData>({
    holderName: '',
    issuerName: '',
    credentialType: '',
    issuanceDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    degree: '',
    gpa: '',
    institution: '',
    additionalAttributes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<IssuedCredential | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare attributes object
      const attributes: Record<string, any> = {
        degree: formData.degree,
        gpa: formData.gpa,
        institution: formData.institution
      };

      // Add additional attributes if provided
      if (formData.additionalAttributes) {
        try {
          const additionalAttrs = JSON.parse(formData.additionalAttributes);
          Object.assign(attributes, additionalAttrs);
        } catch {
          // If JSON parsing fails, add as a simple string
          attributes.additionalInfo = formData.additionalAttributes;
        }
      }

      const credentialData = {
        holderName: formData.holderName,
        issuerName: formData.issuerName,
        credentialType: formData.credentialType,
        issuanceDate: new Date(formData.issuanceDate).toISOString(),
        expirationDate: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : undefined,
        attributes
      };

      const issuedCredential = await CredentialService.issueCredential(credentialData);
      setSuccess(issuedCredential);
      
      // Reset form
      setFormData({
        holderName: '',
        issuerName: '',
        credentialType: '',
        issuanceDate: new Date().toISOString().split('T')[0],
        expirationDate: '',
        degree: '',
        gpa: '',
        institution: '',
        additionalAttributes: ''
      });

    } catch (err: any) {
      setError(err.message || 'Failed to issue credential');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CreateOutlined sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Issue New Credential
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Credential Issued Successfully!
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                <Typography variant="body2">
                  <strong>Credential ID:</strong> {success.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Issued by Worker:</strong> {success.workerId}
                </Typography>
                <Typography variant="body2">
                  <strong>Holder:</strong> {success.holderName}
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> {success.credentialType}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={`Issued at: ${new Date(success.timestamp).toLocaleString()}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 300px' }}
                label="Holder Name"
                name="holderName"
                value={formData.holderName}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <TextField
                sx={{ flex: '1 1 300px' }}
                label="Issuer Name"
                name="issuerName"
                value={formData.issuerName}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 300px' }}
                label="Credential Type"
                name="credentialType"
                value={formData.credentialType}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="e.g., Bachelor's Degree, Certificate"
              />
              <TextField
                sx={{ flex: '1 1 300px' }}
                label="Institution"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="e.g., University of Technology"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 300px' }}
                label="Issuance Date"
                name="issuanceDate"
                type="date"
                value={formData.issuanceDate}
                onChange={handleInputChange}
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                sx={{ flex: '1 1 300px' }}
                label="Expiration Date (Optional)"
                name="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={handleInputChange}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 300px' }}
                label="Degree/Program"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="e.g., Computer Science"
              />
              <TextField
                sx={{ flex: '1 1 300px' }}
                label="GPA (Optional)"
                name="gpa"
                value={formData.gpa}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="e.g., 3.8"
              />
            </Box>
            <TextField
              fullWidth
              label="Additional Attributes (JSON format)"
              name="additionalAttributes"
              value={formData.additionalAttributes}
              onChange={handleInputChange}
              disabled={loading}
              multiline
              rows={3}
              placeholder='{"honors": "Magna Cum Laude", "specialization": "AI/ML"}'
              helperText="Optional: Add custom attributes in JSON format"
            />
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CreateOutlined />}
              sx={{ minWidth: 200 }}
            >
              {loading ? 'Issuing...' : 'Issue Credential'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default IssuancePage;