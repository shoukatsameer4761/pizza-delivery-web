import { apiClient } from "@/lib/api/client";
import type { ApiSuccess, PaginatedData } from "@/types/api";
import type {
  CreateRestaurantRequest,
  Restaurant,
  RestaurantListParams,
  UpdateRestaurantRequest,
} from "@/types/restaurants";

export const restaurantsApi = {
  list: async (params: RestaurantListParams = {}) =>
    (
      await apiClient.get<ApiSuccess<PaginatedData<Restaurant>>>(
        "/restaurants",
        { params },
      )
    ).data.data,
  getById: async (id: string) =>
    (await apiClient.get<ApiSuccess<Restaurant>>(`/restaurants/${id}`)).data
      .data,
  create: async (body: CreateRestaurantRequest) =>
    (await apiClient.post<ApiSuccess<Restaurant>>("/restaurants", body)).data
      .data,
  update: async (id: string, body: UpdateRestaurantRequest) =>
    (await apiClient.patch<ApiSuccess<Restaurant>>(`/restaurants/${id}`, body))
      .data.data,
  updateStatus: async (id: string, status: Restaurant["status"]) =>
    (
      await apiClient.patch<ApiSuccess<Restaurant>>(
        `/restaurants/${id}/status`,
        { status },
      )
    ).data.data,
  archive: async (id: string) =>
    (await apiClient.delete<ApiSuccess<Restaurant>>(`/restaurants/${id}`)).data
      .data,
};
