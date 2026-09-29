"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Edit3,
  Eye,
  Layers,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import {
  ErrorState,
  EmptyState,
  PageLoading,
} from "@/components/shared/states";
import { Pagination } from "@/components/shared/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useTopping,
  useToppingMutations,
  useToppings,
} from "@/hooks/use-catalog";
import { useRestaurant } from "@/providers/restaurant-provider";
import { useAuth } from "@/providers/auth-provider";
import type {
  Topping,
  ToppingInput,
  ToppingStatus,
  ToppingType,
} from "@/types/catalog";
import { cn } from "@/lib/utils/cn";

function statusLabel(status: ToppingStatus) {
  return status === "ACTIVE" ? "Active" : "Inactive";
}

function formatPrice(topping: Topping) {
  return topping.priceMinor === 0
    ? "Free"
    : `${topping.currency} ${(topping.priceMinor / 100).toLocaleString()}`;
}

function ToppingActions({
  topping,
  onDelete,
}: {
  topping: Topping;
  onDelete: () => void;
}) {
  const { selectedRestaurantId } = useRestaurant();
  const mutations = useToppingMutations(selectedRestaurantId);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-label={`Actions for ${topping.name}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="rounded p-2 text-muted-foreground hover:bg-surface-high hover:text-foreground"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-48 rounded-[var(--radius-lg)] border bg-surface-lowest py-1 shadow-lg">
          <Link
            href={`/toppings/${topping.id}`}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-low"
            onClick={() => setOpen(false)}
          >
            <Eye className="h-4 w-4" /> View
          </Link>
          <Link
            href={`/toppings/${topping.id}/edit`}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-low"
            onClick={() => setOpen(false)}
          >
            <Edit3 className="h-4 w-4" /> Edit
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-surface-low"
            onClick={() => {
              mutations.status.mutate({
                id: topping.id,
                status: topping.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              });
              setOpen(false);
            }}
          >
            {topping.status === "ACTIVE" ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function ToppingApiList() {
  const { selectedRestaurantId, isLoading: restaurantLoading } =
    useRestaurant();
  const { isLoading: authLoading, user } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ToppingStatus>("all");
  const [type, setType] = useState<"all" | ToppingType>("all");
  const [sort, setSort] = useState("displayOrder");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Topping | null>(null);
  const query = useToppings(selectedRestaurantId, {
    page,
    pageSize: 20,
    search: search || undefined,
    status: status === "all" ? undefined : status,
    type: type === "all" ? undefined : type,
    sort,
    direction: sort === "name" ? "asc" : "desc",
  });
  const mutations = useToppingMutations(selectedRestaurantId);
  if (
    authLoading ||
    restaurantLoading ||
    (user?.role !== "SUPER_ADMIN" && !selectedRestaurantId)
  )
    return <PageLoading label="Loading restaurant catalog" />;
  if (!selectedRestaurantId)
    return (
      <ErrorState message="No restaurant is available for this account." />
    );
  if (query.isPending || query.isLoading)
    return <PageLoading label="Loading toppings and extras" />;
  if (query.isError)
    return <ErrorState message="Unable to load toppings. Please try again." />;
  const data = query.data;
  const items = data?.items ?? [];
  const summary = data?.summary ?? {
    total: 0,
    active: 0,
    inactive: 0,
    extras: 0,
  };
  const summaryCards: Array<{
    label: string;
    value: number;
    Icon: LucideIcon;
  }> = [
    { label: "Total Toppings", value: summary.total, Icon: Layers },
    { label: "Active", value: summary.active, Icon: Utensils },
    { label: "Inactive", value: summary.inactive, Icon: Layers },
    { label: "Paid Extras", value: summary.extras, Icon: Plus },
  ];
  return (
    <div className="h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <span>›</span>
          <Link href="/menu" className="hover:text-primary">
            Menu
          </Link>
          <span>›</span>
          <span className="text-primary">Toppings &amp; Extras</span>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="type-label-caps text-primary">Catalog management</p>
            <h1 className="type-page-title mt-1">Toppings &amp; Extras</h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              Manage ingredients, sauces, and paid customization options for
              your menu.
            </p>
          </div>
          <Link
            href="/toppings/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-container"
          >
            <Plus className="h-4 w-4" /> Add Topping
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map(({ label, value, Icon }) => (
            <Card key={label} className="flex items-center justify-between p-5">
              <div>
                <p className="type-label-caps text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </Card>
          ))}
        </div>
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b bg-surface-low p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-9 pl-9 text-xs"
                placeholder="Search by topping name..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as "all" | ToppingStatus);
                  setPage(1);
                }}
                className="h-9 rounded-[var(--radius)] border bg-surface-lowest px-3 text-xs"
                aria-label="Filter status"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value as "all" | ToppingType);
                  setPage(1);
                }}
                className="h-9 rounded-[var(--radius)] border bg-surface-lowest px-3 text-xs"
                aria-label="Filter type"
              >
                <option value="all">All Types</option>
                <option value="TOPPING">Toppings</option>
                <option value="EXTRA">Extras</option>
              </select>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-[var(--radius)] border bg-surface-lowest px-3 text-xs"
                aria-label="Sort toppings"
              >
                <option value="displayOrder">Display order</option>
                <option value="name">Name</option>
                <option value="priceMinor">Price</option>
                <option value="updatedAt">Recently updated</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="border-b bg-surface-low text-muted-foreground">
                <tr>
                  {[
                    "Topping",
                    "Type",
                    "Price",
                    "Availability",
                    "Menu Usage",
                    "Updated",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} className="type-table-header px-4 py-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((topping) => (
                  <tr key={topping.id} className="group hover:bg-surface-low">
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/toppings/${topping.id}`}
                        className="font-semibold hover:text-primary hover:underline"
                      >
                        {topping.name}
                      </Link>
                      <p className="mt-0.5 max-w-xs truncate text-[11px] text-muted-foreground">
                        {topping.description ?? "No description"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded bg-surface-high px-2.5 py-1 text-[11px] font-medium">
                        {topping.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold">
                      {formatPrice(topping)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          topping.status === "ACTIVE"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {statusLabel(topping.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {topping.menuItemCount} menus
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {new Date(topping.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <ToppingActions
                        topping={topping}
                        onDelete={() => setDeleteTarget(topping)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <EmptyState message="No toppings match your filters." />
            )}
          </div>
          <Pagination
            page={data?.pagination.page ?? page}
            totalPages={data?.pagination.totalPages ?? 1}
            totalItems={data?.pagination.totalItems ?? 0}
            pageSize={data?.pagination.pageSize ?? 20}
            itemLabel="toppings"
            onPageChange={setPage}
          />
        </Card>
      </div>
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-lg font-semibold">
              Delete {deleteTarget.name}?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The backend will prevent deletion while this topping is assigned
              to menu items.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded border px-4 py-2 text-sm"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded bg-destructive px-4 py-2 text-sm font-semibold text-white"
                onClick={() =>
                  mutations.remove.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  })
                }
              >
                Delete
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export function ToppingApiDetails({ id }: { id: string }) {
  const { selectedRestaurantId } = useRestaurant();
  const query = useTopping(selectedRestaurantId, id);
  if (query.isLoading) return <PageLoading />;
  if (query.isError || !query.data)
    return (
      <ErrorState message="Unable to load this topping. Please try again." />
    );
  const topping = query.data;
  return (
    <div className="h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <Link
          href="/toppings"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Back to Toppings
        </Link>
        <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="type-label-caps text-primary">Topping registry</p>
            <h1 className="type-page-title mt-2">{topping.name}</h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              {topping.description ?? "No description provided."}
            </p>
          </div>
          <Link
            href={`/toppings/${topping.id}/edit`}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius)] bg-surface-high px-4 text-sm font-semibold"
          >
            <Edit3 className="h-4 w-4 text-primary" /> Edit Topping
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-5">
            <p className="type-label-caps text-muted-foreground">Type</p>
            <p className="mt-2 text-xl font-bold">{topping.type}</p>
          </Card>
          <Card className="p-5">
            <p className="type-label-caps text-muted-foreground">Price</p>
            <p className="mt-2 text-xl font-bold">{formatPrice(topping)}</p>
          </Card>
          <Card className="p-5">
            <p className="type-label-caps text-muted-foreground">Menu usage</p>
            <p className="mt-2 text-xl font-bold">{topping.menuItemCount}</p>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Topping configuration</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm md:grid-cols-2">
            <p>
              <span className="text-muted-foreground">Status</span>
              <br />
              <strong>{statusLabel(topping.status)}</strong>
            </p>
            <p>
              <span className="text-muted-foreground">Maximum quantity</span>
              <br />
              <strong>{topping.maxQuantity}</strong>
            </p>
            <p>
              <span className="text-muted-foreground">Required</span>
              <br />
              <strong>{topping.isRequired ? "Yes" : "No"}</strong>
            </p>
            <p>
              <span className="text-muted-foreground">Category</span>
              <br />
              <strong>{topping.category?.name ?? "Unassigned"}</strong>
            </p>
            <p>
              <span className="text-muted-foreground">Updated</span>
              <br />
              <strong>{new Date(topping.updatedAt).toLocaleString()}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ToppingApiForm({ id }: { id?: string }) {
  const { selectedRestaurantId } = useRestaurant();
  const existing = useTopping(selectedRestaurantId, id ?? "");
  const mutations = useToppingMutations(selectedRestaurantId);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ToppingType>("TOPPING");
  const [status, setStatus] = useState<ToppingStatus>("ACTIVE");
  const [price, setPrice] = useState("0");
  const [maxQuantity, setMaxQuantity] = useState("1");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!existing.data || hydrated) return;
    setName(existing.data.name);
    setDescription(existing.data.description ?? "");
    setType(existing.data.type);
    setStatus(existing.data.status);
    setPrice(String(existing.data.priceMinor / 100));
    setMaxQuantity(String(existing.data.maxQuantity));
    setHydrated(true);
  }, [existing.data, hydrated]);
  if (id && existing.isLoading) return <PageLoading />;
  if (id && (existing.isError || !existing.data))
    return <ErrorState message="Unable to load this topping for editing." />;
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const body: ToppingInput = {
      name: name.trim(),
      description: description.trim() || null,
      type,
      status,
      priceMinor: Math.round(Number(price) * 100),
      currency: "PKR",
      isRequired: false,
      maxQuantity: Number(maxQuantity),
      displayOrder: existing.data?.displayOrder ?? 0,
    };
    const action = id
      ? mutations.update.mutateAsync({ id, body })
      : mutations.create.mutateAsync(body);
    void action.then(() => {
      window.location.href = "/toppings";
    });
  };
  return (
    <div className="h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/toppings"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Toppings
            </Link>
            <h1 className="type-page-title mt-2">
              {id ? "Edit Topping" : "Create Topping"}
            </h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              Configure the topping or extra used by your restaurant menu.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/toppings"
              className="rounded border px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              form="topping-form"
              disabled={
                mutations.create.isPending || mutations.update.isPending
              }
              className="rounded bg-primary px-5 py-2 text-sm font-semibold text-white"
            >
              {id ? "Save Changes" : "Create Topping"}
            </button>
          </div>
        </div>
        <form
          id="topping-form"
          onSubmit={save}
          className="grid gap-6 lg:grid-cols-5"
        >
          <Card className="space-y-5 p-6 lg:col-span-3">
            <CardHeader className="p-0">
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <label className="space-y-1 text-sm font-semibold">
              Name
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold">
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded border bg-surface-lowest p-2 text-sm"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm font-semibold">
                Type
                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value as ToppingType)
                  }
                  className="h-10 w-full rounded border bg-surface-lowest px-3"
                >
                  <option value="TOPPING">Topping</option>
                  <option value="EXTRA">Extra</option>
                </select>
              </label>
              <label className="space-y-1 text-sm font-semibold">
                Status
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as ToppingStatus)
                  }
                  className="h-10 w-full rounded border bg-surface-lowest px-3"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>
            </div>
          </Card>
          <Card className="space-y-5 p-6 lg:col-span-2">
            <CardHeader className="p-0">
              <CardTitle>Pricing &amp; Availability</CardTitle>
            </CardHeader>
            <label className="space-y-1 text-sm font-semibold">
              Price (PKR)
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold">
              Maximum portions
              <Input
                type="number"
                min="1"
                max="100"
                value={maxQuantity}
                onChange={(event) => setMaxQuantity(event.target.value)}
              />
            </label>
          </Card>
        </form>
      </div>
    </div>
  );
}
