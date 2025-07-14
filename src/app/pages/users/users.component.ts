import { ChangeDetectionStrategy, ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { Users, UserService } from '../../../core/services/api/users.service';
import { AuthService } from '@auth0/auth0-angular';
import { PasswordService } from '../../../core/services/api/password.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PermissionsService } from '../../../core/services/api/permision.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-users',
  imports: [
    MatIconModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  users: Users[] | null = null;
  page: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;

  detallesUsuario: any = null;
  expandedUserId: string | null = null;
  cargandoDetalleId: string | null = null;

  displayedColumns = ['name', 'email', 'email_verified', 'blocked', 'reset'];

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private passwordService: PasswordService,
    private permissionsService: PermissionsService,
    private snackBar: MatSnackBar
  ) {
    this.auth.isAuthenticated$.subscribe((isAuth) => {
      if (!isAuth) {
        this.auth.loginWithRedirect();
      }
    });
  }

  tienePermiso(permiso: string): boolean {
    return this.permissionsService.tienePermiso(permiso);
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService
      .getUsers(this.page - 1, this.pageSize)
      .subscribe((resp) => {
        this.users = resp.users;
        console.log(this.users);
        this.totalItems = resp.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.cdr.markForCheck();
      });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    console.log(this.pageSize);
    this.cargarUsuarios();
  }

  onToggleBloqueo(user: Users, event: any) {
    if (event.checked) {
      this.bloquear(user);
    } else {
      this.desbloquear(user);
    }
  }

  bloquear(user: Users) {
    const identity = user.identities?.[0];
    this.userService
      .bloquearUsuario(
        `${identity.provider}%7C${identity.user_id}`,
        true,
        'Usuario bloqueado por no cumplir con las normas corporativas.'
      )
      .subscribe({
        next: () => {
          user.blocked = true; // 👈 actualizamos en el array actual
          this.mostrarMensaje('Usuario bloqueado exitosamente');
          this.cdr.markForCheck();
        },
      });
  }

  desbloquear(user: Users) {
    const identity = user.identities?.[0];
    this.userService
      .bloquearUsuario(`${identity.provider}%7C${identity.user_id}`, false, '')
      .subscribe({
        next: () => {
          user.blocked = false; // 👈 también aquí
          this.mostrarMensaje('Usuario desbloqueado exitosamente');
          this.cdr.markForCheck();
        },
      });
  }

  cambiarPassword(email: string) {
    this.passwordService.solicitarCambioPassword(email).subscribe({
      next: (resp) => {
        this.mostrarMensaje('Correo de recuperación enviado');
        console.log('Solicitud enviada', resp);
      },
      error: (err) => {
        console.error('Error al solicitar cambio de contraseña', err);
      },
    });
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  verDetalle(userId: string) {
    if (this.expandedUserId === userId) {
      this.expandedUserId = null;
      this.detallesUsuario = null;
      this.cargandoDetalleId = null;
      this.cdr.markForCheck();
      return;
    }

    this.expandedUserId = userId;
    this.cargandoDetalleId = userId;
    this.detallesUsuario = null;
    this.cdr.markForCheck();

    this.userService.getUserById(userId).subscribe((data) => {
      this.detallesUsuario = data;
      this.cargandoDetalleId = null;
      this.cdr.markForCheck();
    });
  }
}
