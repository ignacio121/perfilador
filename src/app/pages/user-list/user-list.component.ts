import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  Members,
  OrganizationsService,
} from '../../../core/services/api/organizations.service';
import { AuthService, User } from '@auth0/auth0-angular';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { Users, UserService } from '../../../core/services/api/users.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PermissionsService } from '../../../core/services/api/permision.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { EventEmitter, Output } from '@angular/core'


@Component({
  selector: 'app-user-list',
  imports: [
    MatTableModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    CommonModule,
    MatInputModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatIcon,
  ],
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  members: Members[] | null = null;
  user: User | null = null;
  displayedColumns = ['name', 'rut', 'state', 'blocked'];

  expandedUserId: string | null = null;
  detallesUsuario: any = null;
  allColumns = [...this.displayedColumns, 'expandedDetail'];

  cargandoDetalle = false;
  cargandoDetalleId: string | null = null;

  filtroBusqueda: string = '';
  filtroEstado: string = '';

  buscarHabilitado: boolean = false;

  cargando = true;

  constructor(
    private userService: UserService,
    private orgService: OrganizationsService,
    private permissionsService: PermissionsService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargando = true;

    this.auth.user$.subscribe((user) => {
      this.user = user ?? null;

      if (this.user?.['org_id']) {
        this.orgService
          .getMembersOfOrganization(
            this.user['org_id'],
            this.filtroBusqueda,
            this.filtroEstado
          )
          .subscribe((members) => {
            this.members = members;
            this.cargando = false;
            this.cdr.markForCheck(); // si usas ChangeDetectionStrategy.OnPush
          });
      }
    });
  }

  verDetalle(userId: string) {
    // Si ya está abierto, lo cerramos
    if (this.expandedUserId === userId) {
      this.expandedUserId = null;
      this.detallesUsuario = null;
      this.cargandoDetalleId = null;
      this.cdr.markForCheck();
      return;
    }

    this.cargandoDetalleId = userId;
    this.expandedUserId = userId;
    this.detallesUsuario = null;
    this.cdr.markForCheck();

    this.userService
      .getUserById(userId, this.user?.['org_id'])
      .subscribe((data) => {
        this.detallesUsuario = data;
        this.cargandoDetalleId = null;
        this.cdr.markForCheck();
      });
  }

  tienePermiso(permiso: string): boolean {
    return this.permissionsService.tienePermiso(permiso);
  }

  onToggleBloqueo(user: Users, event: any) {
    console.log(user);
    if (event.checked) {
      console.log('aa');
      this.bloquear(user);
    } else {
      console.log('bb');
      this.desbloquear(user);
    }
  }

  bloquear(user: Users) {
    const [provider, user_id] = user.user_id.split('|');
    const identity = user.identities?.[0];
    this.userService
      .bloquearUsuario(
        `${provider}%7C${user_id}`,
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
    const [provider, user_id] = user.user_id.split('|');
    const identity = user.identities?.[0];
    this.userService
      .bloquearUsuario(`${provider}%7C${user_id}`, false, '')
      .subscribe({
        next: () => {
          user.blocked = false; // 👈 también aquí
          this.mostrarMensaje('Usuario desbloqueado exitosamente');
          this.cdr.markForCheck();
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

  onFiltroCambiado() {
    this.buscarHabilitado =
      (!!this.filtroBusqueda && this.filtroBusqueda.trim() !== '') ||
      (!!this.filtroEstado && this.filtroEstado !== '');
  }

  filtrarUsuarios() {
    // Puedes hacer la lógica que desees aquí o delegar a un servicio:
    console.log('Buscar:', this.filtroBusqueda, 'Estado:', this.filtroEstado);

    this.orgService
      .getMembersOfOrganization(
        this.user?.['org_id'],
        this.filtroBusqueda,
        this.filtroEstado === 'all' ? '' : this.filtroEstado
      )
      .subscribe((members) => {
        this.members = members;
        this.cdr.markForCheck();
      });
  }

  @Output() crearUsuario = new EventEmitter<void>();

  abrirModalCrearUsuario() {
    this.crearUsuario.emit();
  }
}
