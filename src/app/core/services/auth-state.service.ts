import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';

// Single source of truth for "is someone currently signed in", read from the same
// localStorage keys login-form.component.ts writes and logout clears everywhere
// (see mock-utils.ts / demo-db.service.ts SESSION_KEYS). The shared site header
// subscribes to isLoggedIn$ instead of reading localStorage itself, so it reflects
// the current session on every page, including public pages, and updates
// immediately on login/logout even when Angular reuses the same component
// instance (e.g. logging out from a public page doesn't navigate to a new route
// tree, so nothing would otherwise force a re-check).
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly loggedIn$ = new BehaviorSubject<boolean>(this.readLoggedIn());
  readonly isLoggedIn$ = this.loggedIn$.asObservable();

  constructor() {
    // Keeps another open tab in sync if the session is started or cleared elsewhere
    // (the native 'storage' event only fires in OTHER tabs, which is exactly the gap
    // a same-tab call to markLoggedIn()/markLoggedOut() can't cover on its own).
    fromEvent<StorageEvent>(window, 'storage').subscribe(event => {
      if (event.key === 'loggedIn' || event.key === 't' || event.key === null) {
        this.refresh();
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.loggedIn$.value;
  }

  refresh(): void {
    this.loggedIn$.next(this.readLoggedIn());
  }

  markLoggedIn(): void {
    this.loggedIn$.next(true);
  }

  markLoggedOut(): void {
    this.loggedIn$.next(false);
  }

  private readLoggedIn(): boolean {
    return localStorage.getItem('loggedIn') === 'true' && !!localStorage.getItem('t');
  }
}
