import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { AuthService } from "@auth0/auth0-angular";
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.startsWith("/api")) {
      return next.handle(req);
    }
 
    return this.auth.idTokenClaims$.pipe(
      switchMap((claims) => {
        return from(this.auth.getAccessTokenSilently());
      }),
      switchMap((accessToken) => {
        console.log(accessToken);
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
        });
        return next.handle(authReq);
      })
    );
  }
}
