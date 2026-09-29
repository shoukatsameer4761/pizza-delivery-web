"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { catalogApi } from "@/lib/api/catalog";
import type {
  CategoryInput,
  CategoryStatus,
  MenuItemInput,
  MenuItemStatus,
  ToppingInput,
  ToppingStatus,
} from "@/types/catalog";

export function useCategories(
  restaurantId: string | null,
  params: Parameters<typeof catalogApi.listCategories>[1],
) {
  return useQuery({
    queryKey: ["categories", restaurantId, params],
    queryFn: () => catalogApi.listCategories(restaurantId as string, params),
    enabled: Boolean(restaurantId),
  });
}
export function useCategory(restaurantId: string | null, categoryId: string) {
  return useQuery({
    queryKey: ["category", restaurantId, categoryId],
    queryFn: () => catalogApi.getCategory(restaurantId as string, categoryId),
    enabled: Boolean(restaurantId && categoryId),
  });
}
export function useCategoryMutations(restaurantId: string | null) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["categories", restaurantId] });
  const options = { onSuccess: invalidate };
  return {
    create: useMutation({
      mutationFn: (body: CategoryInput) =>
        catalogApi.createCategory(restaurantId as string, body),
      ...options,
    }),
    update: useMutation({
      mutationFn: ({
        id,
        body,
      }: {
        id: string;
        body: Partial<CategoryInput>;
      }) => catalogApi.updateCategory(restaurantId as string, id, body),
      ...options,
    }),
    status: useMutation({
      mutationFn: ({ id, status }: { id: string; status: CategoryStatus }) =>
        catalogApi.setCategoryStatus(restaurantId as string, id, status),
      ...options,
    }),
    reorder: useMutation({
      mutationFn: ({
        id,
        direction,
      }: {
        id: string;
        direction: "UP" | "DOWN";
      }) => catalogApi.reorderCategory(restaurantId as string, id, direction),
      ...options,
    }),
    remove: useMutation({
      mutationFn: (id: string) =>
        catalogApi.deleteCategory(restaurantId as string, id),
      ...options,
    }),
  };
}

export function useMenuItems(
  restaurantId: string | null,
  params: Parameters<typeof catalogApi.listMenuItems>[1],
) {
  return useQuery({
    queryKey: ["menu-items", restaurantId, params],
    queryFn: () => catalogApi.listMenuItems(restaurantId as string, params),
    enabled: Boolean(restaurantId),
  });
}
export function useMenuItem(restaurantId: string | null, menuItemId: string) {
  return useQuery({
    queryKey: ["menu-item", restaurantId, menuItemId],
    queryFn: () => catalogApi.getMenuItem(restaurantId as string, menuItemId),
    enabled: Boolean(restaurantId && menuItemId),
  });
}
export function useMenuMutations(restaurantId: string | null) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["menu-items", restaurantId] });
  const options = { onSuccess: invalidate };
  return {
    create: useMutation({
      mutationFn: (body: MenuItemInput) =>
        catalogApi.createMenuItem(restaurantId as string, body),
      ...options,
    }),
    update: useMutation({
      mutationFn: ({
        id,
        body,
      }: {
        id: string;
        body: Partial<MenuItemInput>;
      }) => catalogApi.updateMenuItem(restaurantId as string, id, body),
      ...options,
    }),
    status: useMutation({
      mutationFn: ({
        id,
        status,
        reason,
      }: {
        id: string;
        status: MenuItemStatus;
        reason?: string;
      }) =>
        catalogApi.setMenuItemStatus(
          restaurantId as string,
          id,
          status,
          reason,
        ),
      ...options,
    }),
    duplicate: useMutation({
      mutationFn: ({
        id,
        name,
        slug,
      }: {
        id: string;
        name: string;
        slug: string;
      }) =>
        catalogApi.duplicateMenuItem(restaurantId as string, id, {
          name,
          slug,
        }),
      ...options,
    }),
    remove: useMutation({
      mutationFn: (id: string) =>
        catalogApi.deleteMenuItem(restaurantId as string, id),
      ...options,
    }),
  };
}

export function useToppings(
  restaurantId: string | null,
  params: Parameters<typeof catalogApi.listToppings>[1],
) {
  return useQuery({
    queryKey: ["toppings", restaurantId, params],
    queryFn: () => catalogApi.listToppings(restaurantId as string, params),
    enabled: Boolean(restaurantId),
  });
}

export function useTopping(restaurantId: string | null, toppingId: string) {
  return useQuery({
    queryKey: ["topping", restaurantId, toppingId],
    queryFn: () => catalogApi.getTopping(restaurantId as string, toppingId),
    enabled: Boolean(restaurantId && toppingId),
  });
}

export function useToppingMutations(restaurantId: string | null) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: ["toppings", restaurantId],
    });
  };
  return {
    create: useMutation({
      mutationFn: (body: ToppingInput) =>
        catalogApi.createTopping(restaurantId as string, body),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, body }: { id: string; body: Partial<ToppingInput> }) =>
        catalogApi.updateTopping(restaurantId as string, id, body),
      onSuccess: invalidate,
    }),
    status: useMutation({
      mutationFn: ({ id, status }: { id: string; status: ToppingStatus }) =>
        catalogApi.setToppingStatus(restaurantId as string, id, status),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) =>
        catalogApi.deleteTopping(restaurantId as string, id),
      onSuccess: invalidate,
    }),
  };
}
