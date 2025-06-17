export interface FeedbackRequest {
  projectId: number;
  reviewerId: number;
  comment: string;
  technicalScore: number;
  attitudeScore: number;
}

export interface FeedbackResponse {
  id: number;
  projectId: number;
  reviewerId: number;
  comment: string;
  technicalScore: number;
  attitudeScore: number;
  createdAt: Date;
}
