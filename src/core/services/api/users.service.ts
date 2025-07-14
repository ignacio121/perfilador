import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Identity {
  provider: string;
  user_id: string;
}

export interface Users {
  user_id: string;
  name: string;
  email: string;
  blocked: boolean;
  email_verified: boolean;
  app_metadata: any;
  identities: Identity[];
}

export interface BlockUserPayload {
  blocked: boolean;
  app_metadata: {
    block_type: string;
  };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/user';

  constructor(private http: HttpClient) {}

  getUserById(id: string, orgId: string = ""): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}?org_id=${orgId}`);
  }

  getUsers(page: number = 0, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}?page=${page}&per_page=${pageSize}`
    );
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  bloquearUsuario(id: string, state: boolean, motivo: string): Observable<any> {
    const body: BlockUserPayload = {
      blocked: state,
      app_metadata: {
        block_type: motivo,
      },
    };
    return this.http.patch(`${this.apiUrl}/${id}/bloquear`, body);
  }
}
