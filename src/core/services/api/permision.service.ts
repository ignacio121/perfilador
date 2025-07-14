import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private permisos: string[] = [];

  setPermisos(permisos: string[]) {
    this.permisos = permisos;
  }

  getPermisos(): string[] {
    return this.permisos;
  }

  tienePermiso(permiso: string): boolean {
    return this.permisos.includes(permiso);
  }
}
