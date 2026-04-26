/**
 * Simple localStorage-based profile store for the numerology app.
 * Supports birth name, maiden name, married name, preferred name.
 */

export interface NumerologyProfile {
  fullName: string;        // Birth certificate name (always required)
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  maidenName?: string;     // Pre-marriage last name (optional)
  marriedName?: string;    // Post-marriage full name (optional)
  preferredName?: string;  // Name they go by / nickname (optional)
  nameChanged?: boolean;   // Whether they've had a name change
  primaryName?: "birth" | "married"; // Which chart resonates more (from quiz)
}

// ── App Settings ──
export interface AppSettings {
  showNumbers: boolean;    // Show/hide numeric values on sections (default: false)
  language: "en" | "es";   // Language preference
}

const SETTINGS_KEY = "aionis_settings";

const DEFAULT_SETTINGS: AppSettings = {
  showNumbers: false,
  language: "en",
};

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings(): AppSettings {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return { ...DEFAULT_SETTINGS };
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

const STORAGE_KEY = "aionis_profile";

export function saveProfile(profile: NumerologyProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function loadProfile(): NumerologyProfile | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as NumerologyProfile;
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasProfile(): boolean {
  return loadProfile() !== null;
}

/** Get the name to use for calculations based on what resonates more */
export function getActiveName(profile: NumerologyProfile): string {
  if (profile.primaryName === "married" && profile.marriedName) {
    return profile.marriedName;
  }
  return profile.fullName;
}

/** Get the display name (preferred name or first name) */
export function getDisplayName(profile: NumerologyProfile): string {
  if (profile.preferredName) return profile.preferredName;
  return profile.fullName.split(" ")[0];
}
