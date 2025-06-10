import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespFeedbackRequest, RespFeedbackResponse } from '../_models/resp-feedback';

@Injectable({
  providedIn: 'root'
})
export class RespFeedbackService {
  private apiUrl = 'http://localhost:8080/api/resp-feedback';

  constructor(private http: HttpClient) { }

  createFeedback(request: RespFeedbackRequest): Observable<RespFeedbackResponse> {
    return this.http.post<RespFeedbackResponse>(this.apiUrl, request);
  }

  getFeedbackByProjectId(respProjectId: number): Observable<RespFeedbackResponse[]> {
    return this.http.get<RespFeedbackResponse[]>(`${this.apiUrl}/project/${respProjectId}`);
  }

  getFeedbackByReviewerId(reviewerId: number): Observable<RespFeedbackResponse[]> {
    return this.http.get<RespFeedbackResponse[]>(`${this.apiUrl}/reviewer/${reviewerId}`);
  }

  updateFeedback(feedbackId: number, request: RespFeedbackRequest): Observable<RespFeedbackResponse> {
    return this.http.put<RespFeedbackResponse>(`${this.apiUrl}/${feedbackId}`, request);
  }

  deleteFeedback(feedbackId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${feedbackId}`);
  }
} 