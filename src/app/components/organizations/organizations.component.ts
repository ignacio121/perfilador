import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { UserCreationStateService } from '../../../core/services/api/user-creation-state.service';
import { AppStateService } from '../../../core/services/api/app-state.service';
import { OrganizationsService } from '../../../core/services/api/organizations.service';

import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-organizations",
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: "./organizations.component.html",
  styleUrl: "./organizations.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsComponent {
  @Output() backStep = new EventEmitter<void>();

  nombreUsuario = "";
  orgDisplayName = "";

  optionSelected: boolean = true;

  filtroBusqueda: string = "";
  buscarHabilitado: boolean = false;

  constructor(
    private userCreationState: UserCreationStateService,
    private appState: AppStateService,
    private orgService: OrganizationsService
  ) {
    this.nombreUsuario = this.userCreationState.getUserData().name;
    console.log("Nombre del usuario: ", userCreationState.getUserData().name);

    console.log("Organización activa:", this.appState.organizationName());
    console.log("user id: ", this.appState.userId());
    this.orgDisplayName = this.appState.organizationDisplayName() ?? "";

    this.orgService
      .getOrganizationsOfUserByName(
        this.appState.userId() ?? "",
        this.appState.organizationName() ?? ""
      )
      .subscribe((orgs) => {
        if (orgs && orgs.length > 0) {
          console.log(orgs);
        }
      });
  }

  onFiltroCambiado() {
    this.buscarHabilitado =
      !!this.filtroBusqueda && this.filtroBusqueda.trim() !== "";
  }

  Atras() {
    this.backStep.emit();
  }
}


