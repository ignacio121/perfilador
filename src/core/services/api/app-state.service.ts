import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppStateService {
  // Signals o variables reactivas
  userId = signal<string | null>(null);
  organizationId = signal<string | null>(null);
  organizationName = signal<string | null>(null);
  organizationDisplayName = signal<string | null>(null);

  setOrganization(id: string, name: string, displayName: string) {
    this.organizationId.set(id);
    this.organizationName.set(name);
    this.organizationDisplayName.set(displayName);
  }

  setUserId(id: string) {
    this.userId.set(id);
  }

  clear() {
    this.organizationId.set(null);
    this.organizationName.set(null);
  }
}
