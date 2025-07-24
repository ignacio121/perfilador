import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-data',
  imports: [MatIcon],
  templateUrl: `./user-data.component.html`,
  styleUrl: './user-data.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataComponent {
  @Input() label = 'Label text';
  @Input() helperTop?: string;
  @Input() helperBottom?: string;
  @Input() disabled = false;
  value = '';
  focused = false;
  hovered = false;

  clear() {
    this.value = '';
  }
}
