"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RestaurantMembership } from "@/types/auth";
import { useAuth } from "@/providers/auth-provider";
import { useRestaurants } from "@/hooks/use-platform";
type RestaurantContextValue = {
  selectedRestaurantId: string | null;
  availableRestaurants: RestaurantMembership[];
  isLoading: boolean;
  setSelectedRestaurant: (id: string) => void;
};
const RestaurantContext = createContext<RestaurantContextValue | null>(null);
export function RestaurantProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedRestaurantId, setSelected] = useState<string | null>(null);
  const platformRestaurants = useRestaurants(
    { page: 1, pageSize: 100, sortBy: "name", sortOrder: "asc" },
    user?.role === "SUPER_ADMIN",
  );
  const availableRestaurants = useMemo(() => {
    if (user?.role === "SUPER_ADMIN") {
      return (platformRestaurants.data?.items ?? []).map((restaurant) => ({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        role: user.role,
        permissions: user.permissions,
      }));
    }
    return user?.memberships ?? [];
  }, [
    platformRestaurants.data?.items,
    user?.memberships,
    user?.permissions,
    user?.role,
  ]);
  const setSelectedRestaurant = useCallback(
    (id: string) => {
      if (
        user?.role === "SUPER_ADMIN" ||
        availableRestaurants.some(
          (restaurant) => restaurant.restaurantId === id,
        )
      ) {
        setSelected(id);
      }
    },
    [availableRestaurants, user?.role],
  );
  const value = useMemo(
    () => ({
      selectedRestaurantId:
        selectedRestaurantId ?? availableRestaurants[0]?.restaurantId ?? null,
      availableRestaurants,
      isLoading:
        authLoading ||
        (user?.role === "SUPER_ADMIN" && platformRestaurants.isLoading),
      setSelectedRestaurant,
    }),
    [
      availableRestaurants,
      authLoading,
      platformRestaurants.isLoading,
      selectedRestaurantId,
      setSelectedRestaurant,
      user?.role,
    ],
  );
  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}
export const useRestaurant = () => {
  const value = useContext(RestaurantContext);
  if (!value)
    throw new Error("useRestaurant must be used within RestaurantProvider");
  return value;
};
