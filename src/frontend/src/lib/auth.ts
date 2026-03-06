/**
 * FinRizz Auth — thin wrapper over useInternetIdentity
 * Provides a unified auth interface for the app.
 */

import { useInternetIdentity } from "@/hooks/useInternetIdentity";

export { useInternetIdentity as useAuth };

// Re-export login/logout as named helpers via the hook pattern
// Components should use useAuth() hook directly
export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  identity: ReturnType<typeof useInternetIdentity>["identity"];
};
