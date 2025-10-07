import Joi from 'joi';

export const credentialSchema = Joi.object({
  holderName: Joi.string().min(1).max(100).required(),
  issuerName: Joi.string().min(1).max(100).required(),
  credentialType: Joi.string().min(1).max(50).required(),
  issuanceDate: Joi.string().isoDate().required(),
  expirationDate: Joi.string().isoDate().optional(),
  attributes: Joi.object().required()
});

export const validateCredential = (credential: any) => {
  return credentialSchema.validate(credential);
};