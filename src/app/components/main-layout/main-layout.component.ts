import { ChangeDetectorRef, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { Organization, OrganizationsService } from '../../../core/services/api/organizations.service';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { PermissionsService } from '../../../core/services/api/permision.service';
import { UserService } from '../../../core/services/api/users.service';
import { FechaFormalPipe } from "../../pipes/fecha-formal-pipe";
import { DomSanitizer } from '@angular/platform-browser';
import { AppStateService } from '../../../core/services/api/app-state.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule,
    MatMenuModule,
    FechaFormalPipe,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  isSidenavOpened = true;

  user: User | null = null;
  userDetails: any = null;
  organizations: Organization[] | null = null;
  org_name: string = '';

  today = new Date();

  constructor(
    private auth: AuthService,
    private router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private orgService: OrganizationsService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private permissionsService: PermissionsService,
    private appState: AppStateService,
  ) {
    iconRegistry.addSvgIcon(
      'log-out',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/log-out.svg')
    );
    this.auth.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth && this.router.url === '/') {
        this.router.navigate(['/home']);
      }
    });

    this.auth.getAccessTokenSilently().subscribe((token) => {
      if (token) {
        const decoded: any = jwt_decode(token);
        console.log(decoded);
        // Supón que tus permisos están en decoded.permissions (array de strings)
        this.permissionsService.setPermisos(decoded.permissions || []);
      }
    });

    this.auth.user$.subscribe((user) => {
      this.user = user ?? null;      
      if (this.user) {
        this.appState.setUserId(user?.sub || "");
        this.cargarUsuario();
      }
    });
  }

  ngOnInit() {
    this.orgService.getOrganizationsOfUser().subscribe((orgs) => {
      this.organizations = orgs;

      if (!this.user?.['org_id'] || !this.organizations) return undefined;
      const org = this.organizations.find(
        (o) => o.id === this.user?.['org_id']
      );
      if (org) {
        this.appState.setOrganization(org.id, org.name, org.display_name);
        this.org_name = org.display_name; // si aún lo necesitas en ese componente
      }

    });
    this.cdr.detectChanges();
  }

  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: document.location.origin,
      },
    });
  }

  puedeVerBoton(permiso: string): boolean {
    return this.permissionsService.tienePermiso(permiso);
  }

  cargarUsuario() {
    if (this.user?.sub) {
      this.userService.getUserById(this.user.sub).subscribe((user) => {
        this.userDetails = user;
        console.log(this.userDetails);
        this.cdr.markForCheck();
      });
    }
  }

  changeOrganization(orgId: string) {
    if (orgId !== this.user?.['org_id']) {
      this.auth.loginWithRedirect({
        authorizationParams: {
          organization: orgId,
          redirect_uri: window.location.origin + '/home',
        },
      });
    }
  }
}
