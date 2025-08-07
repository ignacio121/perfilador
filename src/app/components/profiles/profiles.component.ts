import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  signal,
  computed,
} from "@angular/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { UserCreationStateService } from "../../../core/services/api/user-creation-state.service";
import { effect } from "@angular/core";

type PerfilTipo = "basico" | "avanzado" | "personalizado";

interface PerfilAsignado {
  tipo: PerfilTipo;
  subpermisos: string[]; // siempre IDs
  admin: boolean;
}

@Component({
  selector: "app-profiles",
  standalone: true,
  imports: [MatRadioModule, MatCheckboxModule],
  templateUrl: "./profiles.component.html",
  styleUrl: "./profiles.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesComponent {
  @Output() perfilAsignado = new EventEmitter<PerfilAsignado>();
  @Output() stepCompleted = new EventEmitter<void>();
  @Output() backStep = new EventEmitter<void>();

  nombreUsuario = "";

  perfilSeleccionado = signal<PerfilTipo | null>(null);
  subpermisosSeleccionados = signal<string[]>([]);

  adminSeleccionado = signal<{ active: boolean; perfil: PerfilTipo | null }>({
    active: false,
    perfil: null,
  });

  onToggleAdmin(valor: boolean) {
    const perfil = this.perfilSeleccionado();
    this.adminSeleccionado.set({
      active: valor,
      perfil: perfil,
    });
  }

  readonly subpermisosBasicos = [
    "InformacionVentas",
    "ReportesFacturas",
    "Solicitudes",
  ];

  readonly subpermisosAvanzados = [
    "AnularVentas",
    "ResolucionContracargos",
    "ReportesEstrategicos",
  ];

  readonly permisosIds: Record<string, string> = {
    InformacionVentas: "rol_YiXqjg4vGAdxw0O0",
    ReportesFacturas: "rol_CpNKRar8ovTUhwsK",
    Solicitudes: "rol_YfIadLkUE5Ld1jm1",
    AnularVentas: "rol_GPpEBAJT0dTtvnIf",
    ResolucionContracargos: "rol_6CXN0ma3xBG4aLYb",
    ReportesEstrategicos: "rol_RjANWXjfhJ184xVZ",
    AdministradorUsuarios: "rol_rbPpRtrHBllFPjQc",
    VisorPortal: "rol_Tjo4vXhsMZ5AX5s1",
  };

  // para evitar hardcodear IDs otra vez:
  readonly perfilesPredefinidos: Record<
    Exclude<PerfilTipo, "personalizado">,
    string[]
  > = {
    basico: [
      "InformacionVentas",
      "ReportesFacturas",
      "Solicitudes",
      "VisorPortal",
    ].map((nombre) => this.permisosIds[nombre]),

    avanzado: [
      "InformacionVentas",
      "ReportesFacturas",
      "Solicitudes",
      "AnularVentas",
      "ResolucionContracargos",
      "ReportesEstrategicos",
      "VisorPortal",
    ].map((nombre) => this.permisosIds[nombre]),
  };

  perfilValido = computed(() => this.perfilSeleccionado() !== null);

  constructor(private userCreationState: UserCreationStateService) {
    const user = this.userCreationState.getUserData();
    this.nombreUsuario = user?.name ?? "";

    const perfil = this.userCreationState.getPerfil();

    if (perfil) {
      console.log("Tipo de perfil:", perfil.tipo);
      console.log("Roles/Permisos IDs:", perfil.subpermisos); // lista de strings
    }

    const perfilGuardado = this.userCreationState.getPerfil();
    if (perfilGuardado) {
      this.perfilSeleccionado.set(perfilGuardado.tipo as PerfilTipo);

      if (perfilGuardado.tipo === "personalizado") {
        const seleccionados = Object.entries(this.permisosIds)
          .filter(([_, id]) => perfilGuardado.subpermisos.includes(id))
          .map(([key]) => key);

        this.subpermisosSeleccionados.set(seleccionados);
      }

      console.log(perfilGuardado.admin, perfilGuardado.tipo);

      this.adminSeleccionado.set({
        active: perfilGuardado.admin ?? false,
        perfil: perfilGuardado.tipo as PerfilTipo,
      });
    }
  }

  mapPermisoLegible(key: string): string {
    const map: Record<string, string> = {
      InformacionVentas: "Información de ventas y abonos",
      ReportesFacturas: "Reportes y facturas",
      Solicitudes: "Solicitudes",
      AnularVentas: "Anular ventas",
      ResolucionContracargos: "Resolución de contracargos",
      ReportesEstrategicos: "Reportes estratégicos",
      AdministradorUsuarios: "Administrador de usuarios",
    };
    return map[key] || key;
  }

  toggleSubpermiso(nombre: string) {
    const actual = this.subpermisosSeleccionados();
    this.subpermisosSeleccionados.set(
      actual.includes(nombre)
        ? actual.filter((p) => p !== nombre)
        : [...actual, nombre]
    );
  }

  guardarPerfil() {
    const tipo = this.perfilSeleccionado();
    if (!tipo) return;

    const subpermisos =
      tipo === "personalizado"
        ? this.subpermisosSeleccionados().map((p) => this.permisosIds[p])
        : [...this.perfilesPredefinidos[tipo]];

    const admin = this.adminSeleccionado().active;

    if (admin) {
      subpermisos.push(this.permisosIds["AdministradorUsuarios"]);
    }

    const perfilAsignado: PerfilAsignado = {
      tipo,
      subpermisos: Array.from(new Set(subpermisos)),
      admin,
    };

    this.userCreationState.setPerfil(perfilAsignado);
    this.perfilAsignado.emit(perfilAsignado);
    this.stepCompleted.emit();
  }

  Atras() {
    this.backStep.emit();
  }
}
