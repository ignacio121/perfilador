import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Organization,
  OrganizationsService,
} from '../../../core/services/api/organizations.service';
import { UserService } from '../../../core/services/api/users.service';

@Component({
  selector: 'app-post-login-home',
  templateUrl: './post-login-home.component.html',
  styleUrls: ['./post-login-home.component.css'],
  imports: [MatToolbarModule],
})
export class PostLoginHomeComponent {
  user: User | null = null;
  organizations: Organization[] | null = null;
  org_name: string = '';

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private orgService: OrganizationsService,
    private cdr: ChangeDetectorRef
  ) {

    this.auth.user$.subscribe((user) => {
      this.user = user ?? null;
      if (this.user) {
        this.cargarOrganizaciones();
        this.cargarUsuario();
      }
    });
  }

  cargarOrganizaciones() {
    this.orgService.getOrganizationsOfUser().subscribe((orgs) => {
      this.organizations = orgs;
      if (this.user?.['org_id'] && this.organizations) {
        const org = this.organizations.find(
          (o) => o.id === this.user?.['org_id']
        );
        this.org_name = org?.display_name ?? '';
      }
      this.cdr.markForCheck();
    });
  }

  cargarUsuario() {
    if (this.user?.sub) {
      this.userService.getUserById(this.user.sub).subscribe((user) => {
        this.user = user;
        console.log(user)
        this.cdr.markForCheck();
      });
    }
  }
}
