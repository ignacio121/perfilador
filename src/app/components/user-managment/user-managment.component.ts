import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserListComponent } from "../user-list/user-list.component";

import { EventEmitter, Output } from '@angular/core';
import { ProfilesComponent } from '../../pages/profiles/profiles.component';

@Component({
  selector: 'app-user-managment',
  imports: [UserListComponent, ProfilesComponent],
  template: `
    <div class="tabs-wrapper">
      <div class="tabs">
        <button
          class="tab"
          [class.active]="vista === 'usuarios'"
          (click)="vista = 'usuarios'"
        >
          Usuarios
        </button>
        <button
          class="tab"
          [class.active]="vista === 'perfiles'"
          (click)="vista = 'perfiles'"
        >
          Perfiles
        </button>
      </div>
    </div>

    <div class="contenido-tab">
      @if (vista === 'usuarios') {
      <app-user-list (crearUsuario)="crearUsuario.emit()" />
      } @if (vista === 'perfiles') {
      <app-profiles (verUsuarios)="verUsuarios.emit()" />
      }
    </div>
  `,
  styleUrl: './user-managment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagmentComponent {
  vista: 'usuarios' | 'perfiles' = 'usuarios';

  @Output() crearUsuario = new EventEmitter<void>();
  @Output() verUsuarios = new EventEmitter<void>();
}
