import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Organization {
  id: string;
  name: string;
  display_name: string;
}

export interface Members {
  user_id: string;
  name: string;
  email: string;
  picture: string;
}

@Injectable({
  providedIn: "root",
})
export class OrganizationsService {
  private apiUrl = "/api/organization";

  constructor(private http: HttpClient) {}

  getOrganizationsOfUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  getOrganizationsOfUserByName(user_id: string, name: string): Observable<any> {
    const encodedUserId = encodeURIComponent(user_id);
    return this.http.get<any>(
      `${this.apiUrl}/find/me?userId=${encodedUserId}&name=${name}`
    );
  }

  getMembersOfOrganization(
    orgId: string,
    filtroBusqueda: string,
    filtroEstado: string
  ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orgId}/members`, {
      params: {
        search: filtroBusqueda || "",
        blocked: filtroEstado || "",
      },
    });
  }
}
