import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
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
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { EventEmitter, Output } from '@angular/core'
import { OrganizationStorageService } from '../../../core/services/api/organization-storage.service';


@Component({
  selector: "app-user-list",
  imports: [
    MatTableModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatIcon,
  ],
  standalone: true,
  templateUrl: "./user-list.component.html",
  styleUrl: "./user-list.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  @Input() usuarioCreado: boolean = false;
  members: Members[] | null = null;
  user: User | null = null;
  displayedColumns = [
    "name",
    "rut",
    "state",
    "blocked",
    "edit",
    "activeMfa",
  ];

  org_id: string | null = null;

  expandedUserId: string | null = null;
  detallesUsuario: any = null;
  allColumns = [...this.displayedColumns, "expandedDetail"];

  cargandoDetalle = false;
  cargandoDetalleId: string | null = null;

  filtroBusqueda: string = "";
  filtroEstado: string = "";

  buscarHabilitado: boolean = false;

  cargando = true;

  constructor(
    private userService: UserService,
    private orgService: OrganizationsService,
    private switchOrgService: OrganizationStorageService,
    private permissionsService: PermissionsService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.cargando = true;

    this.auth.user$.subscribe((user) => {
      this.user = user ?? null;

      if (this.user?.["org_id"] === "org_0GxkE40Cnmk20HN0") {
        console.log(this.orgService.getOrgSwitched()?.id);
        console.log(this.switchOrgService.getSwitchedOrgId());
        this.org_id = this.switchOrgService.getSwitchedOrgId() || null;
      }
      
      if (this.user?.["org_id"]) {
        this.orgService
          .getMembersOfOrganization(
            this.org_id || this.user?.["org_id"],
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes["usuarioCreado"]?.currentValue) {
      setTimeout(() => {
        this.usuarioCreado = false;
        this.cdr.markForCheck(); // si usas OnPush
      }, 3000);
    }
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
      .getUserById(userId, this.org_id || this.user?.["org_id"])
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
      console.log("aa");
      this.bloquear(user);
    } else {
      console.log("bb");
      this.desbloquear(user);
    }
  }

  bloquear(user: Users) {
    const [provider, user_id] = user.user_id.split("|");
    const identity = user.identities?.[0];
    this.userService
      .bloquearUsuario(
        `${provider}%7C${user_id}`,
        true,
        "Usuario bloqueado por no cumplir con las normas corporativas."
      )
      .subscribe({
        next: () => {
          user.blocked = true; // 👈 actualizamos en el array actual
          this.mostrarMensaje("Usuario bloqueado exitosamente");
          this.cdr.markForCheck();
        },
      });
  }

  desbloquear(user: Users) {
    const [provider, user_id] = user.user_id.split("|");
    const identity = user.identities?.[0];
    this.userService
      .bloquearUsuario(`${provider}%7C${user_id}`, false, "")
      .subscribe({
        next: () => {
          user.blocked = false; // 👈 también aquí
          this.mostrarMensaje("Usuario desbloqueado exitosamente");
          this.cdr.markForCheck();
        },
      });
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, "Cerrar", {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }

  onFiltroCambiado() {
    this.buscarHabilitado =
      (!!this.filtroBusqueda && this.filtroBusqueda.trim() !== "") ||
      (!!this.filtroEstado && this.filtroEstado !== "");
  }

  filtrarUsuarios() {
    // Puedes hacer la lógica que desees aquí o delegar a un servicio:
    console.log("Buscar:", this.filtroBusqueda, "Estado:", this.filtroEstado);

    this.orgService
      .getMembersOfOrganization(
        this.org_id || this.user?.["org_id"],
        this.filtroBusqueda,
        this.filtroEstado === "all" ? "" : this.filtroEstado
      )
      .subscribe((members) => {
        this.members = members;
        this.cdr.markForCheck();
      });
  }

  activeMFA(user_id: string) {
    this.userService.activateMFA(user_id).subscribe({
      next: () => {
        this.mostrarMensaje("MFA activado exitosamente");
      },
    });
  }

  @Output() crearUsuario = new EventEmitter<void>();

  abrirCrearUsuario() {
    this.crearUsuario.emit();
  }

  @Output() editarUsuario = new EventEmitter<void>();

  abrirEditarUsuario() {
    this.editarUsuario.emit();
  }
}
