import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  signal,
  computed,
  Input,
} from "@angular/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CommonModule } from '@angular/common';
import { UserCreationStateService } from "../../../core/services/api/user-creation-state.service";

type PerfilTipo = "basico" | "avanzado" | "personalizado";

interface PerfilAsignado {
  tipo: PerfilTipo;
  subpermisos?: string[]; // solo si es personalizado
}

@Component({
  selector: "app-profiles",
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

  perfilValido = computed(() => {
    const perfil = this.perfilSeleccionado();
    return (
      perfil === "basico" || perfil === "avanzado" || perfil === "personalizado"
    );
  });

  constructor(private userCreationState: UserCreationStateService) {
    this.nombreUsuario = this.userCreationState.getUserData().name;
    console.log("Nombre del usuario: ",userCreationState.getUserData().name);
  }

  readonly subpermisosDisponibles = [
    "InformacionVentas",
    "ReportesFacturas",
    "Solicitudes",
    "AnularVentas",
    "ResolucionContracargos",
    "ReportesEstrategicos",
    "AdministradorUsuarios",
  ];

  toggleSubpermiso(nombre: string) {
    const actual = this.subpermisosSeleccionados();
    if (actual.includes(nombre)) {
      this.subpermisosSeleccionados.set(actual.filter((p) => p !== nombre));
    } else {
      this.subpermisosSeleccionados.set([...actual, nombre]);
    }
  }

  guardarPerfil() {
    console.log(this.perfilSeleccionado(), this.subpermisosSeleccionados());
    if (this.perfilSeleccionado() === "personalizado") {
      this.perfilAsignado.emit({
        tipo: "personalizado",
        subpermisos: this.subpermisosSeleccionados(),
      });
    } else {
      if (this.perfilSeleccionado() !== null) {
        this.perfilAsignado.emit({
          tipo: this.perfilSeleccionado() as PerfilTipo,
        });
        this.stepCompleted.emit();
      }
    }
  }

  Atras() {
    this.backStep.emit();
  }
}

