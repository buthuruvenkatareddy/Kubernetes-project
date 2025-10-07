import Joi from 'joi';

export const verificationRequestSchema = Joi.object({
  credentialId: Joi.string().uuid().required()
});

export const validateVerificationRequest = (request: any) => {
  return verificationRequestSchema.validate(request);
};