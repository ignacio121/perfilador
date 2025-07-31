// user-create.component.ts
import { Component, computed, Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { UserDataComponent } from '../../components/user-data/user-data.component';
import { ProfilesComponent } from '../../components/profiles/profiles.component';
import { OrganizationsComponent } from '../../components/organizations/organizations.component';
import { UserCreationStateService } from '../../../core/services/api/user-creation-state.service';

@Component({
  selector: "app-user-create",
  templateUrl: "./create-user.component.html",
  styleUrl: "./create-user.component.css",
  imports: [
    MatIcon,
    UserDataComponent,
    ProfilesComponent,
    OrganizationsComponent,
  ],
})
export class UserCreateComponent {
  isSubmitting = false;
  currentStep = 1;

  constructor(private userCreationState: UserCreationStateService) {}

  avanzarStep() {
    this.currentStep++;
  }

  retrocederStep() {
    this.currentStep--;
  }

  @Output() verUsuarios = new EventEmitter<void>();

  verUserList() {
    this.verUsuarios.emit();
  }

  onUserDataReceived(data: any) {
    this.userCreationState.setUserData(data);
    console.log("Datos recibidos del formulario:", data);
    this.avanzarStep();
  }
}
