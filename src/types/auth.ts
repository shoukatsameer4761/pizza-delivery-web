export type UserRole =
  "SUPER_ADMIN" | "RESTAURANT_ADMIN" | "RESTAURANT_STAFF" | "CUSTOMER";
export type Permission = string;
export type Role = { id: string; name: UserRole; permissions: Permission[] };
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  permissions?: Permission[];
  roles?: Role[];
  memberships?: RestaurantMembership[];
};
export type RestaurantMembership = {
  restaurantId: string;
  restaurantName: string;
  role: UserRole;
  permissions: Permission[];
};
export type CurrentUser = User & {
  firstName: string;
  lastName: string;
  roles?: Role[];
  permissions: Permission[];
  memberships: RestaurantMembership[];
  permissionsLoaded: boolean;
};
export type AuthState = {
  user: CurrentUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
export type AuthSession = {
  user: User;
  accessToken: string;
  expiresIn: string;
};
export type AuthResponse = { success: true; data: AuthSession };
export type MePayload = {
  user: User;
  restaurants?: Array<{ id: string; name: string }>;
  permissions?: Permission[];
  memberships?: RestaurantMembership[];
};
export type MeResponse =
  User | MePayload | { success: true; data: User | MePayload };
export type ApiErrorBody = {
  success: false;
  error: { code: string; message: string; details?: unknown };
};
