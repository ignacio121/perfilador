import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private apiUrl = '/api/token-info';

  constructor(private http: HttpClient) {}

  getTokenInfo(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
