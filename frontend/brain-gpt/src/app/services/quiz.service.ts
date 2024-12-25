import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  createContest(username: string, topic: string, difficulty: string, numQuestions: any){
    return this.http.post(`${this.baseUrl}/create-contest`, { username, topic, difficulty, numQuestions });
  }
}
