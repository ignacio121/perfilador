import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Organization {
  id: string;
  display_name: string;
}

export interface Members {
  user_id: string;
  name: string;
  email: string;
  picture: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private apiUrl = '/api/organization';

  constructor(private http: HttpClient) {}

  getOrganizationsOfUser(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getMembersOfOrganization(orgId: string, filtroBusqueda: string, filtroEstado: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orgId}/members`, {
      params: {
        search: filtroBusqueda || '',
        blocked: filtroEstado || '',
      }
    });
  }
}
