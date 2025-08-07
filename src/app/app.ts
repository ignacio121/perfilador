import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'perfilador';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this.auth.user$.subscribe((user) => {
      if (user?.["org_name"] === "one-pay") {

        console.log("🧑 Usuario logueado:", user?.["org_name"]);
        this.router.navigate(["/onepay"]);

      }
    });

    this.auth.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth && this.router.url === '/') {
        this.router.navigate(['/home']);
      }
    });
  }
}
