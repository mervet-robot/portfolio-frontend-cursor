// certification-request.model.ts
export interface CertificationRequest {
  name: string;
  issuingOrganization: string;
  issueDate?: string;  // ISO format (YYYY-MM-DD)
  expiryDate?: string;  // ISO format (YYYY-MM-DD)
  certificateUrl?: string;
  validationLink?: string;
}

// certification-response.model.ts
export interface CertificationResponse {
  id: number;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expiryDate?: string;  // ISO format (YYYY-MM-DD)
  certificateUrl?: string;
  validationLink?: string;
  profileId: number;
  certifMediaId?: number;
}
