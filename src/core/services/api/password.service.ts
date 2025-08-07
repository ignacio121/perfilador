import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const authConfig = require('../../../../proxy.conf.json');

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private url = 'https://ciamtbk-dev.transbank.auth0.com/dbconnections/change_password';

  constructor(private http: HttpClient) {}

  solicitarCambioPassword(email: string): Observable<any> {
    const body = {
      client_id: authConfig.clientId,
      email,
      connection: "PoC-Portal-TBK-Comercios",
    };

    return this.http.post(this.url, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text',
    });
  }
}
