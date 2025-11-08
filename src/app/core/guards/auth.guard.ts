import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiServicesService } from 'src/app/api-services.service';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router, private authService: ApiService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.authService.getToken();
    if (token) {
      return this.authService.getUserRole().pipe(
        map((response: any) => {
          const userRole = response.user[0]?.user_role?.role_name;

          const allowedRoles = route.data['allowedRoles'] || [];

          if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
            return true;
          } else {
            return this.router.createUrlTree(['/access-denied']);
          }
        }),
        catchError(() => {
          return of(this.router.createUrlTree(['/']));
        })
      );
    } else {
      return this.router.createUrlTree(['/']);
    }
  }
}
