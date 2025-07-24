import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-profiles',
  imports: [],
  template: `<p>profiles works!</p>`,
  styleUrl: './profiles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesComponent { }
