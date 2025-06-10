export interface RespFeedbackRequest {
  respProjectId: number;
  reviewerId: number;
  comment: string;
  technicalScore: number;
  attitudeScore: number;
}

export interface RespFeedbackResponse {
  id: number;
  respProjectId: number;
  reviewerId: number;
  comment: string;
  technicalScore: number;
  attitudeScore: number;
  createdAt: Date;
} 