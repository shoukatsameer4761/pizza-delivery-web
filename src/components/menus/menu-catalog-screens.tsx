"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Edit3,
  PackageCheck,
  PauseCircle,
  Pizza,
  Search,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";

import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { Pagination } from "@/components/shared/pagination";
import { ErrorState, PageLoading } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import {
  useMenuItem,
  useMenuItems,
  useMenuMutations,
  useCategories,
} from "@/hooks/use-catalog";
import { useRestaurant } from "@/providers/restaurant-provider";
import { useAuth } from "@/providers/auth-provider";
import type { MenuItem as ApiMenuItem, MenuItemStatus } from "@/types/catalog";

type Status = "Active" | "Unavailable" | "Draft";
type MenuRecord = {
  id: string;
  name: string;
  category: string;
  description: string;
  prices: string[];
  orders: string;
  status: Status;
  updated: string;
};

const statusStyles: Record<Status, string> = {
  Active: "bg-tertiary/10 text-tertiary",
  Unavailable: "bg-error/10 text-error",
  Draft: "bg-secondary-container text-on-secondary-container",
};

function Crumbs({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <Link href="/dashboard" className="hover:text-primary">
        Dashboard
      </Link>
      <span>/</span>
      <Link href="/menu" className="hover:text-primary">
        Menu
      </Link>
      <span>/</span>
      <span className="font-semibold text-foreground">{current}</span>
    </div>
  );
}

export function MenuCatalogList() {
  const { selectedRestaurantId, isLoading: restaurantLoading } =
    useRestaurant();
  const { isLoading: authLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MenuRecord | null>(null);
  const categoriesQuery = useCategories(selectedRestaurantId, {
    page: 1,
    pageSize: 100,
    sort: "displayOrder",
    direction: "asc",
  });
  const menuQuery = useMenuItems(selectedRestaurantId, {
    page,
    pageSize: 20,
    search: query || undefined,
    categoryId: categoryId || undefined,
    status:
      status === "all" ? undefined : (status.toUpperCase() as MenuItemStatus),
    sort,
    direction: sort === "name" || sort === "price" ? "asc" : "desc",
  });
  const mutations = useMenuMutations(selectedRestaurantId);
  const items = (menuQuery.data?.items ?? []).map(toMenuRecord);
  const summary = menuQuery.data?.summary ?? {
    total: 0,
    active: 0,
    unavailable: 0,
    draft: 0,
  };
  if (authLoading || restaurantLoading)
    return <PageLoading label="Loading restaurant catalog" />;
  if (!selectedRestaurantId)
    return (
      <ErrorState message="No restaurant is available for this account." />
    );
  if (menuQuery.isPending || menuQuery.isLoading || categoriesQuery.isPending)
    return <PageLoading label="Loading menu" />;
  if (menuQuery.isError)
    return (
      <ErrorState message="Unable to load menu items. Please try again." />
    );
  return (
    <div className="h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-1">
          <Crumbs current="Pizzas" />
          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="type-page-title">Pizzas</h1>
              <p className="mt-1 text-body-reg text-muted-foreground">
                Manage pizzas available on your restaurant menu.
              </p>
            </div>
            <Link
              href="/menu/create"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-container"
            >
              <span className="text-lg">+</span>Add Pizza
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Total Pizzas"
            value={String(summary.total)}
            detail="Live catalog total"
            icon={Pizza}
            tone="text-primary"
          />
          <Stat
            label="Active"
            value={String(summary.active)}
            detail="Currently available"
            icon={CheckCircle2}
            tone="text-tertiary"
          />
          <Stat
            label="Unavailable"
            value={String(summary.unavailable)}
            detail="Temporarily unavailable"
            icon={PauseCircle}
            tone="text-error"
          />
          <Stat
            label="Draft"
            value={String(summary.draft)}
            detail="Hidden from menu"
            icon={Edit3}
            tone="text-secondary"
          />
        </div>
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-surface-container p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-10 pl-9"
                placeholder="Search by pizza name..."
              />
            </div>
            <div className="grid w-full gap-2 sm:grid-cols-3 lg:w-auto">
              <select
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-[var(--radius)] border bg-surface-lowest px-3 text-sm"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {(categoriesQuery.data?.items ?? []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-[var(--radius)] border bg-surface-lowest px-3 text-sm"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="unavailable">Unavailable</option>
                <option value="draft">Draft</option>
              </select>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-[var(--radius)] border bg-surface-lowest px-3 text-sm"
                aria-label="Sort menu items"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="price">Sort: Price (Low to High)</option>
                <option value="updatedAt">Sort: Recently Updated</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b bg-surface-low text-muted-foreground">
                <tr>
                  {[
                    "Pizza",
                    "Category",
                    "Sizes / Starting Price",
                    "Orders",
                    "Status",
                    "Updated",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} className="type-table-header px-4 py-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-surface-low"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-surface-high text-primary">
                          <Pizza className="h-6 w-6" />
                        </div>
                        <div>
                          <Link
                            href={`/menu/${item.id}`}
                            className="text-sm font-semibold hover:text-primary hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="max-w-xs truncate text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.category}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium">
                        <span className="text-outline">S</span> {item.prices[0]}{" "}
                        · <span className="text-outline">M</span>{" "}
                        {item.prices[1]} ·{" "}
                        <span className="text-outline">L</span> {item.prices[2]}
                      </div>
                      <div className="mt-1 text-[11px] text-tertiary">
                        Starting at Rs. {item.prices[0]}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      {item.orders}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase",
                          statusStyles[item.status],
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {item.updated}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActionsMenu
                        label={item.name}
                        actions={[
                          { label: "View", href: `/menu/${item.id}` },
                          { label: "Edit", href: `/menu/${item.id}/edit` },
                          { label: "Duplicate", onSelect: () => undefined },
                          {
                            label:
                              item.status === "Active"
                                ? "Mark Unavailable"
                                : item.status === "Draft"
                                  ? "Publish Draft"
                                  : "Mark Active",
                            onSelect: () =>
                              mutations.status.mutate({
                                id: item.id,
                                status:
                                  item.status === "Active"
                                    ? "UNAVAILABLE"
                                    : "ACTIVE",
                              }),
                          },
                          {
                            label: "Delete",
                            destructive: true,
                            dividerBefore: true,
                            onSelect: () => setSelected(item),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={menuQuery.data?.pagination.page ?? page}
            totalPages={menuQuery.data?.pagination.totalPages ?? 1}
            totalItems={menuQuery.data?.pagination.totalItems ?? 0}
            pageSize={menuQuery.data?.pagination.pageSize ?? 20}
            itemLabel="pizzas"
            onPageChange={setPage}
          />
        </Card>
      </div>
      {selected && (
        <MenuDeleteConfirmation
          item={selected}
          onClose={() => setSelected(null)}
          onDelete={() =>
            mutations.remove.mutate(selected.id, {
              onSuccess: () => setSelected(null),
            })
          }
        />
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Pizza;
  tone: string;
}) {
  return (
    <Card className="flex items-center justify-between p-5">
      <div>
        <p className="type-label-caps text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
        <p className={cn("mt-1 text-xs font-medium", tone)}>{detail}</p>
      </div>
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-surface-low",
          tone,
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
    </Card>
  );
}

function MenuDeleteConfirmation({
  item,
  onClose,
  onDelete,
}: {
  item: MenuRecord;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-inverse-surface/60 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-pizza-title"
        className="w-full max-w-[480px] rounded-[var(--radius-lg)] border bg-surface-container-lowest p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-error-container text-error">
            <Trash2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="delete-pizza-title" className="type-section-title">
              Delete {item.name}?
            </h2>
            <p className="mt-1 text-body-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close delete confirmation"
            className="rounded p-1 text-muted-foreground hover:bg-surface-high"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 rounded-[var(--radius-lg)] bg-surface-low p-4">
          <p className="text-body-sm text-muted-foreground">
            <strong className="text-foreground">{item.name}</strong> will be
            removed from the active Pizza House catalog. Historical order
            records will remain available.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t border-surface-container pt-4">
          <Button
            type="button"
            className="bg-surface-container text-foreground hover:bg-surface-container-high"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onDelete}
            className="bg-error text-white hover:bg-error/90"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Pizza
          </Button>
        </div>
      </section>
    </div>
  );
}

export function MenuCatalogDetails({ id }: { id: string }) {
  const { selectedRestaurantId } = useRestaurant();
  const menuQuery = useMenuItem(selectedRestaurantId, id);
  if (menuQuery.isLoading) return <PageLoading />;
  if (menuQuery.isError || !menuQuery.data)
    return (
      <ErrorState message="Unable to load this menu item. Please try again." />
    );
  const item = toMenuRecord(menuQuery.data);
  const sizes = [
    ['Small (8")', "4 Slices · 1-2 Persons", item.prices[0]],
    ['Medium (12")', "6 Slices · 2-3 Persons", item.prices[1]],
    ['Large (16")', "8 Slices · 4-5 Persons", item.prices[2]],
  ];
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-[1440px] pb-16">
        <div className="flex flex-col justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-8">
          <Crumbs current={item.name} />
          <div className="flex items-center gap-3">
            <Link
              href={`/menu/${item.id}/edit`}
              className="inline-flex h-10 items-center gap-2 rounded-[var(--radius)] bg-surface-high px-4 text-sm font-medium hover:bg-surface-highest"
            >
              <Edit3 className="h-4 w-4" />
              Edit Pizza
            </Link>
            <details className="relative">
              <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-[var(--radius)] bg-primary px-4 text-sm font-medium text-white hover:bg-primary-container">
                More <span>⌄</span>
              </summary>
              <div className="absolute right-0 z-30 mt-2 w-48 rounded-[var(--radius-lg)] border bg-surface-container-lowest p-1 shadow-xl">
                <Link
                  href={`/menu/${item.id}/edit`}
                  className="block rounded px-3 py-2 text-sm hover:bg-surface-low"
                >
                  Duplicate Pizza
                </Link>
                <button
                  type="button"
                  className="block w-full rounded px-3 py-2 text-left text-sm text-error hover:bg-error/10"
                >
                  Deactivate
                </button>
              </div>
            </details>
          </div>
        </div>
        <div className="relative flex min-h-[320px] items-end overflow-hidden bg-inverse-surface px-4 py-8 sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(184,0,53,.5),transparent_42%)]" />
          <div className="relative flex w-full flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="rounded-full bg-tertiary px-3 py-1 text-xs font-semibold uppercase text-white">
                  {item.status}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90">
                  Category: {item.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                {item.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
                Authentic tandoori spiced chicken chunks layered over rich
                makhani sauce, topped with fresh mozzarella, capsicum, red
                onions, and house cilantro-mint chutney.
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] bg-white/10 px-4 py-3 text-white backdrop-blur-md">
              <div className="text-xs uppercase text-white/70">Base Price</div>
              <div className="text-xl font-bold">Rs. {item.prices[0]}</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-1 gap-8 px-4 -mt-6 sm:px-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <DetailStat
                label="Total Orders"
                value={item.orders}
                detail="+12% this week"
                icon={TrendingUp}
              />
              <DetailStat
                label="Starting Price"
                value={`Rs. ${item.prices[0]}`}
                detail="Small size baseline"
                icon={Pizza}
              />
              <DetailStat
                label="Active Sizes"
                value="3 Sizes"
                detail="Small, Medium, Large"
                icon={CheckCircle2}
              />
              <DetailStat
                label="Prep Time"
                value="15 min"
                detail="Average kitchen timer"
                icon={Clock3}
              />
            </div>
            <Card className="overflow-hidden p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="type-card-title">Size & Pricing Matrix</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Configured dimensions and active stock availability for
                    Pizza House.
                  </p>
                </div>
                <span className="rounded bg-surface-high px-2.5 py-1 text-xs font-semibold">
                  3 Variants
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead className="bg-surface-low text-muted-foreground">
                    <tr>
                      {[
                        "Size Name",
                        "Dimensions",
                        "Base Price",
                        "Status",
                        "Action",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="type-table-header px-4 py-3"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {sizes.map(([name, dimension, price]) => (
                      <tr key={name} className="hover:bg-surface-low">
                        <td className="px-4 py-4 text-sm font-semibold">
                          {name}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {dimension}
                        </td>
                        <td className="px-4 py-4 font-mono text-sm font-medium">
                          Rs. {price}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-tertiary/10 px-2 py-1 text-xs font-medium text-tertiary">
                            Available
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            Configure
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="type-card-title">
                Recipe & Ingredient Specifications
              </h2>
              <div className="mt-4 grid gap-6 text-sm md:grid-cols-2">
                <div className="space-y-4">
                  <Spec
                    label="Sauce Base"
                    value="Signature Makhani Tomato Gravy (Mild Spice)"
                  />
                  <Spec
                    label="Cheese Blend"
                    value="100% Real Mozzarella & Paneer Crumble hints"
                  />
                  <Spec
                    label="Allergens"
                    value="Dairy, Gluten, Garlic, Onion"
                  />
                </div>
                <div className="space-y-4">
                  <Spec
                    label="Dough Type"
                    value="Hand-tossed Sourdough (48hr Fermentation)"
                  />
                  <Spec
                    label="Special Instructions"
                    value="Bake at 380°C in Stone Oven for 4.5 minutes"
                  />
                  <Spec label="SKU Identifier" value="PZ-CHK-TIK-009" mono />
                </div>
              </div>
            </Card>
          </div>
          <Card className="h-fit p-6 lg:col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="type-card-title">Recent Activity</h2>
              <span className="text-xs font-semibold text-primary">
                Live Log
              </span>
            </div>
            <div className="space-y-6">
              <ActivityLine
                icon={Edit3}
                label="Price Updated"
                time="Today, 2:45 PM"
              />
              <ActivityLine
                icon={PackageCheck}
                label="Stock Restocked"
                time="Yesterday, 11:20 AM"
              />
              <ActivityLine
                icon={CheckCircle2}
                label="Status Set to Active"
                time="Oct 24, 4:15 PM"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function toMenuRecord(item: ApiMenuItem): MenuRecord {
  return {
    id: item.id,
    name: item.name,
    category: item.category?.name ?? "Menu",
    description: item.description ?? "",
    prices: item.sizes.map((size) => String(Math.round(size.priceMinor / 100))),
    orders: String(item.orderCount),
    status:
      item.status === "ACTIVE"
        ? "Active"
        : item.status === "UNAVAILABLE"
          ? "Unavailable"
          : "Draft",
    updated: new Date(item.updatedAt).toLocaleDateString(),
  };
}

function DetailStat({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Pizza;
}) {
  return (
    <Card className="flex flex-col justify-between p-5">
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <span className="type-label-caps">{label}</span>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
    </Card>
  );
}
function Spec({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <span className="type-label-caps text-muted-foreground">{label}</span>
      <p className={cn("mt-0.5 font-medium", mono && "font-mono")}>{value}</p>
    </div>
  );
}
function ActivityLine({
  icon: Icon,
  label,
  time,
}: {
  icon: typeof Edit3;
  label: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{time}</p>
        <p className="mt-0.5 text-sm font-semibold">{label}</p>
      </div>
    </div>
  );
}
