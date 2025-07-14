import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { TokenService } from '../../../core/services/api/token-info.service';
import { UserService } from '../../../core/services/api/users.service';
import { AuthService } from '@auth0/auth0-angular';
import { PermissionsService } from '../../../core/services/api/permision.service';

@Component({
  selector: 'app-permisos-test',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <button (click)="cargarPermisos()">Cargar permisos</button>
    <button (click)="cargarTokenInfo()">Ver informacion del token</button>
    <button (click)="cargarUsers()">Ver usuarios</button>
    <pre>{{ permisos | json }}</pre>
    <pre>{{ tokenInfo | json }}</pre>
  `,
})
export class PermisosTestComponent implements OnInit {
  permisos: any;
  tokenInfo: any;
  users: any;

  constructor(
    private auth: AuthService,
    private permissionsService: PermissionsService,
    private tokenService: TokenService,
    private UserService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.auth.isAuthenticated$.subscribe((isAuth) => {
      if (!isAuth) {
        this.auth.loginWithRedirect();
      }
    });
  }

  ngOnInit() {}

  cargarPermisos() {
    this.permisos = this.permissionsService.getPermisos();
    console.log(this.permisos)
  }

  cargarTokenInfo() {
    this.tokenService.getTokenInfo().subscribe((data) => {
      this.tokenInfo = data;
      console.log('Token info:', data);
      this.cdr.detectChanges();
    });
  }

  cargarUsers() {
    this.UserService.getUsers().subscribe((data) => {
      this.users = data;
      console.log('Users:', data);
      this.cdr.detectChanges();
    });
  }
}
