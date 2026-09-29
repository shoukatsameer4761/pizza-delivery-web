"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { administrationsApi } from "@/lib/api/administrations";
import { dashboardApi } from "@/lib/api/dashboard";
import { restaurantsApi } from "@/lib/api/restaurants";
import type { AdministratorListParams } from "@/types/administrations";
import type {
  RestaurantListParams,
  RestaurantStatus,
} from "@/types/restaurants";

export function useDashboardOverview(
  params?: Parameters<typeof dashboardApi.overview>[0],
) {
  return useQuery({
    queryKey: ["dashboard-overview", params],
    queryFn: () => dashboardApi.overview(params),
  });
}
export function useRestaurants(params: RestaurantListParams, enabled = true) {
  return useQuery({
    queryKey: ["restaurants", params],
    queryFn: () => restaurantsApi.list(params),
    enabled,
  });
}
export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => restaurantsApi.getById(id),
    enabled: Boolean(id),
  });
}
export function useRestaurantMutations() {
  const client = useQueryClient();
  return {
    status: useMutation({
      mutationFn: ({ id, status }: { id: string; status: RestaurantStatus }) =>
        restaurantsApi.updateStatus(id, status),
      onSuccess: () => client.invalidateQueries({ queryKey: ["restaurants"] }),
    }),
    archive: useMutation({
      mutationFn: (id: string) => restaurantsApi.archive(id),
      onSuccess: (_restaurant, id) => {
        client.removeQueries({ queryKey: ["restaurant", id] });
        return client.invalidateQueries({ queryKey: ["restaurants"] });
      },
    }),
  };
}
export function useAdministrations(params: AdministratorListParams) {
  return useQuery({
    queryKey: ["administrations", params],
    queryFn: () => administrationsApi.list(params),
  });
}
export function useAdministration(id: string) {
  return useQuery({
    queryKey: ["administration", id],
    queryFn: () => administrationsApi.getById(id),
    enabled: Boolean(id),
  });
}
export function useAdministrationMutations() {
  const client = useQueryClient();
  return {
    status: useMutation({
      mutationFn: ({
        id,
        status,
      }: {
        id: string;
        status: "ACTIVE" | "SUSPENDED";
      }) => administrationsApi.updateStatus(id, status),
      onSuccess: () =>
        client.invalidateQueries({ queryKey: ["administrations"] }),
    }),
  };
}
