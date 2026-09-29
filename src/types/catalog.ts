export type CategoryStatus = "ACTIVE" | "INACTIVE";
export type MenuItemStatus = "ACTIVE" | "UNAVAILABLE" | "DRAFT";
export type ToppingStatus = "ACTIVE" | "INACTIVE";
export type ToppingType = "TOPPING" | "EXTRA";

export type Category = {
  id: string;
  restaurantId: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  status: CategoryStatus;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  items?: Array<{ id: string; name: string; status: MenuItemStatus }>;
};

export type MenuSize = {
  id: string;
  name: string;
  diameterInches: number | null;
  slices: number | null;
  servingDescription: string | null;
  priceMinor: number;
  currency: string;
  isAvailable: boolean;
  displayOrder: number;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  status: MenuItemStatus;
  imageUrl: string | null;
  prepTimeMinutes: number;
  kitchenStation: string | null;
  sku: string | null;
  ingredients: string[];
  allergens: string[];
  sauceBase: string | null;
  cheeseBlend: string | null;
  doughType: string | null;
  specialInstructions: string | null;
  sizes: MenuSize[];
  startingPriceMinor: number | null;
  currency: string;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string };
};

export type Topping = {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  type: ToppingType;
  status: ToppingStatus;
  priceMinor: number;
  currency: string;
  isRequired: boolean;
  maxQuantity: number;
  displayOrder: number;
  menuItemCount: number;
  category: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type CatalogPage<T> = {
  items: T[];
  summary: Record<string, number>;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export type CategoryInput = Pick<
  Category,
  "name" | "slug" | "description" | "displayOrder" | "status"
>;
export type MenuSizeInput = Omit<MenuSize, "id">;
export type MenuItemInput = Omit<
  MenuItem,
  | "id"
  | "restaurantId"
  | "createdAt"
  | "updatedAt"
  | "orderCount"
  | "startingPriceMinor"
  | "sizes"
  | "category"
> & { sizes: MenuSizeInput[] };
export type ToppingInput = Pick<
  Topping,
  | "name"
  | "description"
  | "type"
  | "status"
  | "priceMinor"
  | "currency"
  | "isRequired"
  | "maxQuantity"
  | "displayOrder"
>;
