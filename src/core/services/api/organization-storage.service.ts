import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: "root",
})
export class OrganizationStorageService {
  private readonly ORG_KEY = "switched_org";
  private readonly ORG_EXP_KEY = "switched_org_exp";

  constructor(private auth: AuthService) {}

  setSwitchedOrg(orgData: any): void {
    this.auth.getAccessTokenSilently().subscribe((token) => {
      try {
        const decoded: any = jwtDecode(token);
        const expirationTime = decoded.exp * 1000;

        sessionStorage.setItem(this.ORG_KEY, JSON.stringify(orgData));
        sessionStorage.setItem(this.ORG_EXP_KEY, expirationTime.toString());
        console.log(
          "Organización guardada con expiración:",
          new Date(expirationTime)
        );
      } catch (error) {
        console.error("Error obteniendo expiración del token:", error);
      }
    });
  }

  getSwitchedOrg(): any | null {
    const org = sessionStorage.getItem(this.ORG_KEY);
    const expiration = sessionStorage.getItem(this.ORG_EXP_KEY);

    if (!org || !expiration) return null;

    if (Date.now() > parseInt(expiration)) {
      this.clearSwitchedOrg();
      return null;
    }

    return JSON.parse(org);
  }

  getSwitchedOrgId(): string | null {
    const org = this.getSwitchedOrg();
    return org ? org.id : null;
  }

  clearSwitchedOrg(): void {
    sessionStorage.removeItem(this.ORG_KEY);
    sessionStorage.removeItem(this.ORG_EXP_KEY);
    console.log("Organización eliminada");
  }
}