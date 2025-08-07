import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of, tap, timer } from 'rxjs';
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [MatIconModule, AsyncPipe],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit {
  @ViewChild("loginSection", { static: false }) loginSection!: ElementRef;
  loginVisible = true;
  lastScrollPosition = 0;
  scrollingUp = false;

  error$!: Observable<any>;

  constructor(
    private auth: AuthService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "log-in",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/log-in.svg")
    );

    this.error$ = this.auth.error$;
  }

  ngAfterViewInit() {
    if (this.loginSection) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          this.loginVisible = entry.isIntersecting;
        },
        {
          root: null,
          threshold: 0.5,
        }
      );
      observer.observe(this.loginSection.nativeElement);
    }
  }

  login(
    conecction: string = "Username-Password-Authentication",
    organization: string = ""
  ) {
    this.auth.loginWithRedirect({
      authorizationParams: {
        connection: conecction,
        organization: organization,
      },
    });
  }

  scrollToLogin() {
    this.loginSection.nativeElement.scrollIntoView({ behavior: "smooth" });
    this.loginVisible = true;
  }

  @HostListener("window:scroll", [])
  onScroll() {
    const currentScrollPosition = window.scrollY;

    this.scrollingUp = currentScrollPosition < this.lastScrollPosition;

    if (this.scrollingUp && !this.loginVisible) {
      this.loginVisible = false;
    }

    this.lastScrollPosition = currentScrollPosition;
  }

  retry() {
    window.location.reload();
  }

  errorVisible: boolean = false;

  ngOnInit() {
    this.error$ = this.auth.error$.pipe(
      tap((error) => {
        if (error) {
          this.errorVisible = true;
          timer(3000).subscribe(() => (this.errorVisible = false));
        }
      })
    );
  }
}
