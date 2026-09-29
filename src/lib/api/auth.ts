import { apiClient } from "@/lib/api/client";
import type {
  AuthResponse,
  CurrentUser,
  LoginRequest,
  MeResponse,
  MePayload,
  Permission,
  RestaurantMembership,
  User,
} from "@/types/auth";

const normalizeUser = (
  user: User,
  context?: Omit<MePayload, "user">,
): CurrentUser => {
  const [firstName = "", ...lastNameParts] = user.name.trim().split(/\s+/);
  const permissions: Permission[] =
    context?.permissions ?? user.permissions ?? [];
  const restaurants =
    context?.restaurants ??
    context?.memberships?.map((membership) => ({
      id: membership.restaurantId,
      name: membership.restaurantName,
    })) ??
    user.memberships?.map((membership) => ({
      id: membership.restaurantId,
      name: membership.restaurantName,
    })) ??
    [];
  const memberships: RestaurantMembership[] =
    context?.memberships ??
    restaurants.map((restaurant) => ({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      role: user.role,
      permissions,
    }));
  return {
    ...user,
    firstName,
    lastName: lastNameParts.join(" "),
    permissions,
    memberships,
    roles: user.roles ?? [],
    permissionsLoaded:
      Array.isArray(context?.permissions) || Array.isArray(user.permissions),
  };
};

const normalizeSession = (response: AuthResponse) => ({
  accessToken: response.data.accessToken,
  user: normalizeUser(response.data.user),
});

const unwrapMe = (response: MeResponse): MePayload => {
  if ("success" in response) return unwrapMe(response.data);
  if ("user" in response) return response;
  return { user: response };
};

export const authApi = {
  login: async (body: LoginRequest) =>
    normalizeSession(
      (await apiClient.post<AuthResponse>("/auth/login", body)).data,
    ),
  refresh: async () =>
    normalizeSession(
      (await apiClient.post<AuthResponse>("/auth/refresh")).data,
    ),
  logout: async () => {
    await apiClient.post("/auth/logout");
  },
  me: async () => {
    const payload = unwrapMe(
      (await apiClient.get<MeResponse>("/auth/me")).data,
    );
    return normalizeUser(payload.user, payload);
  },
};
