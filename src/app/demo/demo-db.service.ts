import { Injectable } from '@angular/core';
import { DemoDatabase } from './models';
import { buildSeedDatabase } from './seed-data';

const STORAGE_KEY = 'bpls_demo_db_v1';

// Every demo-session key this app writes to localStorage, so "Reset demo data" can
// clear session/UI state alongside the database itself. Keys come from api-services.service.ts,
// login.component.ts, the sidebar/header components and the map/signature widgets.
const SESSION_KEYS = ['isLoggedIn', 'loggedIn', 't', 'r', 'u', 'sn', 'ddOpen', 'vad', 'mapView'];

@Injectable({ providedIn: 'root' })
export class DemoDbService {
  private db: DemoDatabase;

  constructor() {
    this.db = this.load();
  }

  private load(): DemoDatabase {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DemoDatabase;
        if (parsed && parsed.version === buildSeedDatabase().version) {
          return parsed;
        }
      }
    } catch {
      // fall through to reseed
    }
    const seeded = buildSeedDatabase();
    this.persist(seeded);
    return seeded;
  }

  private persist(db: DemoDatabase): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  get data(): DemoDatabase {
    return this.db;
  }

  save(): void {
    this.persist(this.db);
  }

  resetToSeed(): void {
    this.db = buildSeedDatabase();
    this.persist(this.db);
    SESSION_KEYS.forEach(key => localStorage.removeItem(key));
  }
}
