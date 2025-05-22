// certification-request.model.ts
export interface CertificationRequest {
  name: string;
  issuingOrganization: string;
  issueDate?: string;  // ISO format (YYYY-MM-DD)
  expirationDate?: string;  // ISO format (YYYY-MM-DD)
  credentialId?: string;
  credentialUrl?: string;
}

// certification-response.model.ts
export interface CertificationResponse {
  id: number;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  profileId: number;
}
