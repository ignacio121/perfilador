import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserCreateComponent } from '../../components/create-user/create-user.component';
import { UserManagmentComponent } from "../user-managment/user-managment.component";

@Component({
  selector: 'app-my-users',
  imports: [UserCreateComponent, UserManagmentComponent],
  template: `<div class="layout">
    <h2>Mis usuarios</h2>
    <a class="text"
      >En este módulo podrías crear y administrar usuarios. También revisar el
      registro de modificaciones.</a
    >

    <div class="contenido">
      @if(vistaActual === 'listado'){
      <app-user-managment (crearUsuario)="mostrar('crear')" />
      } @if(vistaActual === 'crear'){
      <app-user-create (verUsuarios)="mostrar('listado')" />
      }
    </div>
  </div>`,
  styleUrl: './my-users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyUsersComponent {
  vistaActual: 'listado' | 'crear' = 'listado';

  mostrar(vista: 'listado' | 'crear') {
    this.vistaActual = vista;
  }
}
