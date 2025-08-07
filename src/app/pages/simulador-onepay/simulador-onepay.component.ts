// simulador-onepay.component.ts
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: "app-simulador-onepay",
  templateUrl: "./simulador-onepay.component.html",
  styleUrls: ["./simulador-onepay.component.css"],
  imports: [MatIcon]
})
export class SimuladorOnepayComponent {
  user$: any;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      if (user?.["org_name"] === "one-pay") {
        console.log("🧑 Usuario logueado:", user?.["org_name"]);
      }
      this.user$ = user;

      console.log(this.user$);
    });
  }

  logout() {
    this.authService.logout({
      logoutParams: {
        returnTo: document.location.origin,
      },
    });
  }
}
