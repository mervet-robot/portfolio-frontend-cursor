// soft-skill-request.model.ts
export interface SoftSkillRequest {
  name: string;
  // Add any other fields that match your SoftSkillRequest DTO
}

// soft-skill-response.model.ts
export interface SoftSkillResponse {
  id: number;
  name: string;
  profileId: number;
  // Add any other fields that match your SoftSkillResponse DTO
}
