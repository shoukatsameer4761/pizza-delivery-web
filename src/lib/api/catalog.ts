import { apiClient } from "@/lib/api/client";
import type { ApiSuccess } from "@/types/api";
import type {
  CatalogPage,
  Category,
  CategoryInput,
  CategoryStatus,
  MenuItem,
  MenuItemInput,
  MenuItemStatus,
  Topping,
  ToppingInput,
  ToppingStatus,
  ToppingType,
} from "@/types/catalog";

const restaurantPath = (restaurantId: string, resource: string) =>
  `/restaurants/${restaurantId}/${resource}`;

export const catalogApi = {
  listCategories: async (
    restaurantId: string,
    params: {
      page: number;
      pageSize: number;
      search?: string;
      status?: CategoryStatus;
      sort?: string;
      direction?: string;
    },
  ) =>
    (
      await apiClient.get<ApiSuccess<CatalogPage<Category>>>(
        restaurantPath(restaurantId, "categories"),
        { params },
      )
    ).data.data,
  getCategory: async (restaurantId: string, categoryId: string) =>
    (
      await apiClient.get<ApiSuccess<{ category: Category }>>(
        restaurantPath(restaurantId, `categories/${categoryId}`),
      )
    ).data.data.category,
  createCategory: async (restaurantId: string, body: CategoryInput) =>
    (
      await apiClient.post<ApiSuccess<{ category: Category }>>(
        restaurantPath(restaurantId, "categories"),
        body,
      )
    ).data.data.category,
  updateCategory: async (
    restaurantId: string,
    categoryId: string,
    body: Partial<CategoryInput>,
  ) =>
    (
      await apiClient.patch<ApiSuccess<{ category: Category }>>(
        restaurantPath(restaurantId, `categories/${categoryId}`),
        body,
      )
    ).data.data.category,
  setCategoryStatus: async (
    restaurantId: string,
    categoryId: string,
    status: CategoryStatus,
  ) =>
    (
      await apiClient.post<ApiSuccess<{ category: Category }>>(
        restaurantPath(restaurantId, `categories/${categoryId}/status`),
        { status },
      )
    ).data.data.category,
  reorderCategory: async (
    restaurantId: string,
    categoryId: string,
    direction: "UP" | "DOWN",
  ) =>
    (
      await apiClient.post<ApiSuccess<{ items: Category[] }>>(
        restaurantPath(restaurantId, `categories/${categoryId}/reorder`),
        { direction },
      )
    ).data.data,
  deleteCategory: async (restaurantId: string, categoryId: string) => {
    await apiClient.delete(
      restaurantPath(restaurantId, `categories/${categoryId}`),
    );
  },
  listMenuItems: async (
    restaurantId: string,
    params: {
      page: number;
      pageSize: number;
      search?: string;
      categoryId?: string;
      status?: MenuItemStatus;
      sort?: string;
      direction?: string;
    },
  ) =>
    (
      await apiClient.get<ApiSuccess<CatalogPage<MenuItem>>>(
        restaurantPath(restaurantId, "menu-items"),
        { params },
      )
    ).data.data,
  getMenuItem: async (restaurantId: string, menuItemId: string) =>
    (
      await apiClient.get<ApiSuccess<{ menuItem: MenuItem }>>(
        restaurantPath(restaurantId, `menu-items/${menuItemId}`),
      )
    ).data.data.menuItem,
  createMenuItem: async (restaurantId: string, body: MenuItemInput) =>
    (
      await apiClient.post<ApiSuccess<{ menuItem: MenuItem }>>(
        restaurantPath(restaurantId, "menu-items"),
        body,
      )
    ).data.data.menuItem,
  updateMenuItem: async (
    restaurantId: string,
    menuItemId: string,
    body: Partial<MenuItemInput>,
  ) =>
    (
      await apiClient.patch<ApiSuccess<{ menuItem: MenuItem }>>(
        restaurantPath(restaurantId, `menu-items/${menuItemId}`),
        body,
      )
    ).data.data.menuItem,
  setMenuItemStatus: async (
    restaurantId: string,
    menuItemId: string,
    status: MenuItemStatus,
    reason?: string,
  ) =>
    (
      await apiClient.post<ApiSuccess<{ menuItem: MenuItem }>>(
        restaurantPath(restaurantId, `menu-items/${menuItemId}/status`),
        { status, reason },
      )
    ).data.data.menuItem,
  duplicateMenuItem: async (
    restaurantId: string,
    menuItemId: string,
    body: { name: string; slug: string },
  ) =>
    (
      await apiClient.post<ApiSuccess<{ menuItem: MenuItem }>>(
        restaurantPath(restaurantId, `menu-items/${menuItemId}/duplicate`),
        body,
      )
    ).data.data.menuItem,
  deleteMenuItem: async (restaurantId: string, menuItemId: string) => {
    await apiClient.delete(
      restaurantPath(restaurantId, `menu-items/${menuItemId}`),
    );
  },
  listToppings: async (
    restaurantId: string,
    params: {
      page: number;
      pageSize: number;
      search?: string;
      status?: ToppingStatus;
      type?: ToppingType;
      sort?: string;
      direction?: string;
    },
  ) =>
    (
      await apiClient.get<ApiSuccess<CatalogPage<Topping>>>(
        restaurantPath(restaurantId, "toppings"),
        { params },
      )
    ).data.data,
  getTopping: async (restaurantId: string, toppingId: string) =>
    (
      await apiClient.get<ApiSuccess<Topping>>(
        restaurantPath(restaurantId, `toppings/${toppingId}`),
      )
    ).data.data,
  createTopping: async (restaurantId: string, body: ToppingInput) =>
    (
      await apiClient.post<ApiSuccess<Topping>>(
        restaurantPath(restaurantId, "toppings"),
        body,
      )
    ).data.data,
  updateTopping: async (
    restaurantId: string,
    toppingId: string,
    body: Partial<ToppingInput>,
  ) =>
    (
      await apiClient.patch<ApiSuccess<Topping>>(
        restaurantPath(restaurantId, `toppings/${toppingId}`),
        body,
      )
    ).data.data,
  setToppingStatus: async (
    restaurantId: string,
    toppingId: string,
    status: ToppingStatus,
  ) =>
    (
      await apiClient.patch<ApiSuccess<Topping>>(
        restaurantPath(restaurantId, `toppings/${toppingId}/status`),
        { status },
      )
    ).data.data,
  deleteTopping: async (restaurantId: string, toppingId: string) => {
    await apiClient.delete(
      restaurantPath(restaurantId, `toppings/${toppingId}`),
    );
  },
};
