import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: "app-edit-user",
  imports: [MatIcon],
  templateUrl: "./edit-user.component.html",
  styleUrl: "./edit-user.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserComponent {
  @Output() verUsuarios = new EventEmitter<{ creado?: boolean }>();

  verUserList(creado = false) {
    this.verUsuarios.emit({ creado });
  }
}
