"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CakeSlice,
  CheckCircle2,
  CupSoda,
  PauseCircle,
  Pizza,
  Search,
  Tags,
  Utensils,
} from "lucide-react";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import {
  ErrorState,
  EmptyState,
  PageLoading,
} from "@/components/shared/states";
import { Pagination } from "@/components/shared/pagination";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCategories,
  useCategory,
  useCategoryMutations,
} from "@/hooks/use-catalog";
import { useRestaurant } from "@/providers/restaurant-provider";
import { useAuth } from "@/providers/auth-provider";
import type { Category } from "@/types/catalog";
import { cn } from "@/lib/utils/cn";

const icons = [Pizza, Utensils, CupSoda, CakeSlice];

export function CategoryApiList() {
  const { selectedRestaurantId, isLoading: restaurantLoading } =
    useRestaurant();
  const { isLoading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Category | null>(null);
  const query = useCategories(selectedRestaurantId, {
    page,
    pageSize: 20,
    search: search || undefined,
    status:
      status === "all"
        ? undefined
        : (status.toUpperCase() as "ACTIVE" | "INACTIVE"),
    sort: "displayOrder",
    direction: "asc",
  });
  const mutations = useCategoryMutations(selectedRestaurantId);
  if (authLoading || restaurantLoading)
    return <PageLoading label="Loading restaurant catalog" />;
  if (!selectedRestaurantId)
    return (
      <ErrorState message="No restaurant is available for this account." />
    );
  if (query.isPending || query.isLoading)
    return <PageLoading label="Loading categories" />;
  if (query.isError)
    return (
      <ErrorState message="Unable to load categories. Please try again." />
    );
  const data = query.data;
  const items = data?.items ?? [];
  const summary = data?.summary ?? {
    total: 0,
    active: 0,
    inactive: 0,
    menuItems: 0,
  };
  return (
    <div className="h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Link href="/dashboard" className="hover:text-primary">
              Dashboard
            </Link>
            <span>›</span>
            <Link href="/menu" className="hover:text-primary">
              Menu
            </Link>
            <span>›</span>
            <span className="text-primary">Categories</span>
          </div>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="type-page-title">Categories</h1>
              <p className="mt-1 text-body-reg text-muted-foreground">
                Organize your restaurant menu into clear customer-facing
                categories.
              </p>
            </div>
            <Link
              href="/menu/categories/create"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-container"
            >
              + Add Category
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Summary
            label="Total Categories"
            value={summary.total}
            icon={Tags}
            tone="text-primary"
          />
          <Summary
            label="Active"
            value={summary.active}
            icon={CheckCircle2}
            tone="text-success"
          />
          <Summary
            label="Inactive"
            value={summary.inactive}
            icon={PauseCircle}
            tone="text-destructive"
          />
          <Summary
            label="Menu Items"
            value={summary.menuItems}
            icon={Utensils}
            tone="text-foreground"
          />
        </div>
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-10 pl-10"
                placeholder="Search category name..."
              />
            </div>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="h-10 rounded-[var(--radius)] border bg-surface-low px-3 text-sm md:w-44"
              aria-label="Filter category status"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b bg-surface-low text-muted-foreground">
                <tr>
                  {[
                    "Category",
                    "Description",
                    "Items count",
                    "Status",
                    "Display Order",
                    "Updated date",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} className="type-table-header px-4 py-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((category, index) => {
                  const Icon = icons[index % icons.length];
                  return (
                    <tr
                      key={category.id}
                      className="transition-colors hover:bg-surface-low"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <Link
                              href={`/menu/categories/${category.id}`}
                              className="font-semibold hover:text-primary hover:underline"
                            >
                              {category.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {category.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-xs truncate px-4 py-4 text-body-sm text-muted-foreground">
                        {category.description ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-body-sm font-semibold">
                        {category.itemCount} items
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                            category.status === "ACTIVE"
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive",
                          )}
                        >
                          {category.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono text-body-sm">
                        {String(category.displayOrder).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground">
                        {new Date(category.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <RowActionsMenu
                          label={category.name}
                          actions={[
                            {
                              label: "View",
                              href: `/menu/categories/${category.id}`,
                            },
                            {
                              label: "Edit",
                              href: `/menu/categories/${category.id}/edit`,
                            },
                            ...(category.status === "ACTIVE"
                              ? [
                                  {
                                    label: "Move Up",
                                    onSelect: () =>
                                      mutations.reorder.mutate({
                                        id: category.id,
                                        direction: "UP",
                                      }),
                                  },
                                  {
                                    label: "Move Down",
                                    onSelect: () =>
                                      mutations.reorder.mutate({
                                        id: category.id,
                                        direction: "DOWN",
                                      }),
                                  },
                                  {
                                    label: "Deactivate",
                                    onSelect: () =>
                                      mutations.status.mutate({
                                        id: category.id,
                                        status: "INACTIVE",
                                      }),
                                  },
                                ]
                              : [
                                  {
                                    label: "Activate",
                                    onSelect: () =>
                                      mutations.status.mutate({
                                        id: category.id,
                                        status: "ACTIVE",
                                      }),
                                  },
                                ]),
                            {
                              label: "Delete",
                              destructive: true,
                              dividerBefore: true,
                              onSelect: () => setSelected(category),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {items.length === 0 && (
              <EmptyState message="No categories match your filters." />
            )}
          </div>
          <Pagination
            page={data?.pagination.page ?? page}
            totalPages={data?.pagination.totalPages ?? 1}
            totalItems={data?.pagination.totalItems ?? 0}
            pageSize={data?.pagination.pageSize ?? 20}
            itemLabel="categories"
            onPageChange={setPage}
          />
        </Card>
      </div>
      {selected && (
        <DeleteCategoryDialog
          categoryName={selected.name}
          itemCount={selected.itemCount}
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

function Summary({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Tags;
  tone: string;
}) {
  return (
    <Card className="flex items-center justify-between p-5">
      <div>
        <p className="type-label-caps text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
      </div>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-surface-low",
          tone,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
}

export function CategoryApiDetails({ id }: { id: string }) {
  const { selectedRestaurantId } = useRestaurant();
  const query = useCategory(selectedRestaurantId, id);
  if (query.isLoading) return <PageLoading />;
  if (query.isError || !query.data)
    return (
      <ErrorState message="Unable to load this category. Please try again." />
    );
  const category = query.data;
  return (
    <div className="h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1180px] space-y-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:underline"
        >
          ← Back to Categories
        </Link>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="type-page-title">{category.name}</h1>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  category.status === "ACTIVE"
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {category.status}
              </span>
            </div>
            <p className="mt-1 text-body-reg text-muted-foreground">
              {category.description ?? "No description provided."}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/menu/categories/${category.id}/edit`}
              className="inline-flex h-10 items-center rounded-[var(--radius)] bg-surface-high px-4 text-sm font-semibold hover:bg-surface-highest"
            >
              Edit Category
            </Link>
            <Link
              href="/menu/create"
              className="inline-flex h-10 items-center rounded-[var(--radius)] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-container"
            >
              + Add Item
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Summary
            label="Menu Items"
            value={category.itemCount}
            icon={Utensils}
            tone="text-primary"
          />
          <Summary
            label="Display Order"
            value={category.displayOrder}
            icon={Tags}
            tone="text-foreground"
          />
          <Summary
            label="Status"
            value={category.status === "ACTIVE" ? 1 : 0}
            icon={category.status === "ACTIVE" ? CheckCircle2 : PauseCircle}
            tone={
              category.status === "ACTIVE" ? "text-success" : "text-destructive"
            }
          />
        </div>
        <Card className="p-6">
          <h2 className="type-card-title">Category Information</h2>
          <div className="mt-5 grid gap-5 text-sm md:grid-cols-2">
            <div>
              <span className="type-label-caps text-muted-foreground">
                Slug
              </span>
              <p className="mt-1 font-mono">{category.slug}</p>
            </div>
            <div>
              <span className="type-label-caps text-muted-foreground">
                Last Updated
              </span>
              <p className="mt-1">
                {new Date(category.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
