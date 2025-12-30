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
import { OrganizationStorageService } from '../../../core/services/api/organization-storage.service';

@Component({
  selector: "app-main-layout",
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
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.css"],
})
export class MainLayoutComponent {
  isSidenavOpened = true;

  user: User | null = null;
  userDetails: any = null;
  organizations: Organization[] | null = null;
  org_name: string = "";
  org_selected: string = "";

  access_token: any = null;
  user_type: string = "";

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
    private orgStorage: OrganizationStorageService
  ) {
    iconRegistry.addSvgIcon(
      "log-out",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/log-out.svg")
    );
    this.auth.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth && this.router.url === "/") {
        this.router.navigate(["/home"]);
      }
    });

    this.auth.getAccessTokenSilently().subscribe((token) => {
      if (token) {
        const decoded: any = jwt_decode(token);
        console.log(decoded);
        // Supón que tus permisos están en decoded.permissions (array de strings)
        this.permissionsService.setPermisos(decoded.permissions || []);

        this.access_token = decoded;
        if (
          this.access_token.permissions.find((perm: string) =>
            perm.includes("consultivo_psp")
          ) === "consultivo_psp"
        ) {
          this.user_type = "psp";
        } else {
          this.user_type = "tbk";
        }
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
    // Verificar si hay una organización cambiada guardada
    const switchedOrg = this.orgStorage.getSwitchedOrg();
    if (switchedOrg) {
      this.org_name = switchedOrg.display_name;
      this.org_selected = switchedOrg.id;
    }
    
    if (this.user?.["org_id"] === "org_0GxkE40Cnmk20HN0") {
      console.log("User info:", this.user?.["org_name"]);
      console.log(this.organizations);

      console.log(this.user_type)
      this.orgService.findOrganizationType(this.user_type).subscribe((orgs) => {
        console.log(orgs);
        this.organizations = orgs;
        this.cdr.detectChanges();
      });


      console.log(this.organizations);
    } else {
      this.orgService.getOrganizationsOfUser().subscribe((orgs) => {
        this.organizations = orgs;

        if (!this.user?.["org_id"] || !this.organizations) return undefined;
        const org = this.organizations.find(
          (o) => o.id === this.user?.["org_id"]
        );
        if (org) {
          this.appState.setOrganization(org.id, org.name, org.display_name);
          this.org_name = org.display_name; // si aún lo necesitas en ese componente
        }
      });
    }

    this.cdr.detectChanges();
  }

  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  logout() {
    this.orgStorage.clearSwitchedOrg();
    this.userService.unactivateSkipMFA(this.user?.sub || "").subscribe({
      next: () => {
        console.log("Skip MFA deactivated successfully");
        this.auth.logout({
          logoutParams: {
            returnTo: document.location.origin,
          },
        });
      },
    });
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
    if (this.user?.["org_id"] === "org_0GxkE40Cnmk20HN0") {
      console.log(this.organizations);

      this.orgService.switchOrganization(orgId).subscribe((orgData) => {
        console.log("Respuesta completa del switch:", orgData);
        
        this.orgStorage.setSwitchedOrg(orgData);
        this.org_name = orgData.display_name;
        this.org_selected = orgData.id;
        
        this.cdr.detectChanges();
      });
    } else {
      if (orgId !== this.user?.["org_id"]) {
        this.auth.loginWithRedirect({
          authorizationParams: {
            organization: orgId,
            redirect_uri: window.location.origin + "/home",
            // 🔽 Aquí la clave para detectar cambio de org sin MFA
          },
        });
      }
    }
  }
}
