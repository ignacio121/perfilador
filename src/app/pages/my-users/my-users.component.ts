import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserCreateComponent } from '../create-user/create-user.component';
import { UserManagmentComponent } from '../../components/user-managment/user-managment.component';
import { EditUserComponent } from '../edit-user/edit-user.component';


@Component({
  selector: "app-my-users",
  imports: [UserCreateComponent, UserManagmentComponent, EditUserComponent],
  template: `<div class="layout">
    <h2>Mis usuarios</h2>
    <a class="text"
      >En este módulo podrías crear y administrar usuarios. También revisar el
      registro de modificaciones.</a
    >

    <div class="contenido">
      @if(vistaActual === 'listado'){
      <app-user-managment
        (crearUsuario)="mostrar('crear')"
        (editarUsuario)="mostrar('editar')"
        [usuarioCreado]="usuarioCreado"
      />
      } @if(vistaActual === 'crear') {
      <app-user-create (verUsuarios)="mostrar('listado', $event.creado)" />

      } @if(vistaActual === 'editar') {
      <app-edit-user (verUsuarios)="mostrar('listado')" />
      }
    </div>
  </div>`,
  styleUrl: "./my-users.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyUsersComponent {
  vistaActual: "listado" | "crear" | "editar" = "listado";
  usuarioCreado: boolean = false;

  mostrar(vista: "listado" | "crear" | "editar", creado: boolean = false) {
    this.vistaActual = vista;
    this.usuarioCreado = creado;
  }
}
