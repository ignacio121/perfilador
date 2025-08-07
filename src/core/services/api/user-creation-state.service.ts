import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class UserCreationStateService {
  private userData: any = null;
  private perfil: { tipo: string; subpermisos: string[], admin: boolean } | null = null;

  setUserData(data: any) {
    this.userData = data;
  }

  getUserData(): any {
    return this.userData;
  }

  setPerfil(perfil: { tipo: string; subpermisos: string[], admin: boolean }) {
    console.log(perfil);
    this.perfil = perfil;
  }

  getPerfil(): { tipo: string; subpermisos: string[], admin: boolean } | null {
    return this.perfil;
  }

  clear() {
    this.userData = null;
    this.perfil = null;
  }
}