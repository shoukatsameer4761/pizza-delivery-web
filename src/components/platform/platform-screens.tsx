"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Download, Mail, TrendingUp } from "lucide-react";
import {
  useAdministration,
  useAdministrationMutations,
  useAdministrations,
  useDashboardOverview,
  useRestaurantMutations,
  useRestaurants,
} from "@/hooks/use-platform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorState, PageLoading } from "@/components/shared/states";
import { Pagination } from "@/components/shared/pagination";
import { RowActionsMenu } from "@/components/shared/row-actions-menu";
import { cn } from "@/lib/utils/cn";
import type { RestaurantStatus } from "@/types/restaurants";
import { RestaurantDetailsScreen } from "@/components/restaurants/restaurant-details-screen";

export function PlatformDashboard() {
  const query = useDashboardOverview();
  if (query.isLoading) return <PageLoading />;
  if (query.isError || !query.data)
    return <ErrorState message="Unable to load dashboard data." />;
  const data = query.data;
  const metrics = [
    [
      "Total Revenue",
      `${data.revenue.currency} ${data.revenue.value.toLocaleString()}`,
      data.revenue.changePercent,
    ],
    [
      "Total Orders",
      data.orders.value.toLocaleString(),
      data.orders.changePercent,
    ],
    [
      "Active Restaurants",
      `${data.restaurants.active} / ${data.restaurants.value}`,
      0,
    ],
    [
      "Total Customers",
      data.customers.value.toLocaleString(),
      data.customers.changePercent,
    ],
  ];
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="type-page-title">Dashboard</h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              Platform overview and operational performance.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-[var(--radius)] border bg-surface-lowest px-3 text-body-sm"
            >
              <CalendarDays className="h-4 w-4" />
              Today
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-[var(--radius)] border bg-surface-lowest px-3 text-body-sm"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value, change]) => (
            <Card key={String(label)} className="p-4">
              <p className="type-label-caps text-muted-foreground">
                {String(label)}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {String(value)}
              </p>
              <p className="mt-1 flex items-center gap-1 text-body-sm text-success">
                <TrendingUp className="h-3.5 w-3.5" />
                {String(change)}% vs previous
              </p>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Orders Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-end gap-2 rounded-[var(--radius)] border border-dashed bg-surface-low p-4">
                {data.orderVolume.length ? (
                  data.orderVolume.map((bar) => (
                    <div
                      key={bar.label}
                      className="flex-1 rounded-t-sm bg-primary/70"
                      style={{ height: `${Math.max(4, bar.value)}%` }}
                      title={`${bar.label}: ${bar.value}`}
                    />
                  ))
                ) : (
                  <p className="m-auto text-body-sm text-muted-foreground">
                    Order metrics will appear when orders are available.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recentActivity.length ? (
                data.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="border-b pb-3 text-body-sm last:border-0"
                  >
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-body-sm text-muted-foreground">
                  No recent activity.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function PlatformRestaurants() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RestaurantStatus | undefined>();
  const query = useRestaurants({
    page,
    pageSize: 20,
    search: search || undefined,
    status,
  });
  const mutations = useRestaurantMutations();
  if (query.isLoading) return <PageLoading />;
  if (query.isError || !query.data)
    return <ErrorState message="Unable to load restaurants." />;
  const data = query.data;
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="type-page-title">Restaurants</h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              Manage and monitor restaurants across the platform.
            </p>
          </div>
          <Link
            href="/restaurants/create"
            className="inline-flex h-10 items-center rounded-[var(--radius)] bg-primary px-4 text-sm font-semibold text-white"
          >
            + Add Restaurant
          </Link>
        </div>
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b bg-surface-low p-4 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="h-9 w-full sm:w-72"
              placeholder="Search restaurants..."
            />
            <select
              value={status ?? "ALL"}
              onChange={(event) => {
                setStatus(
                  event.target.value === "ALL"
                    ? undefined
                    : (event.target.value as RestaurantStatus),
                );
                setPage(1);
              }}
              className="h-9 rounded-[var(--radius)] border bg-surface-lowest px-3 text-body-sm"
              aria-label="Filter restaurant status"
            >
              <option value="ALL">Status: All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b bg-surface-high text-muted-foreground">
                <tr>
                  {[
                    "Restaurant",
                    "Contact",
                    "Location",
                    "Status",
                    "Created",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} className="type-table-header px-4 py-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.items.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-muted">
                    <td className="px-4 py-4">
                      <Link
                        href={`/restaurants/${restaurant.id}`}
                        className="font-semibold hover:text-primary hover:underline"
                      >
                        {restaurant.name}
                      </Link>
                      <p className="font-mono text-xs text-muted-foreground">
                        @{restaurant.slug}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-body-sm text-muted-foreground">
                      <p>{restaurant.phone ?? "—"}</p>
                      <p>{restaurant.email ?? "—"}</p>
                    </td>
                    <td className="px-4 py-4 text-body-sm">
                      {restaurant.city ?? restaurant.address ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-xs font-semibold",
                          restaurant.status === "ACTIVE"
                            ? "bg-success/10 text-success"
                            : restaurant.status === "SUSPENDED"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {restaurant.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">
                      {new Date(restaurant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <RowActionsMenu
                        label={restaurant.name}
                        actions={[
                          {
                            label: "View",
                            href: `/restaurants/${restaurant.id}`,
                          },
                          {
                            label: "Edit",
                            href: `/restaurants/${restaurant.id}/edit`,
                          },
                          {
                            label:
                              restaurant.status === "ACTIVE"
                                ? "Deactivate"
                                : "Activate",
                            onSelect: () =>
                              mutations.status.mutate({
                                id: restaurant.id,
                                status:
                                  restaurant.status === "ACTIVE"
                                    ? "INACTIVE"
                                    : "ACTIVE",
                              }),
                          },
                          {
                            label: "Delete",
                            destructive: true,
                            dividerBefore: true,
                            disabled: mutations.archive.isPending,
                            onSelect: () => {
                              if (
                                window.confirm(
                                  `Archive ${restaurant.name}? It will be removed from active operations but retained for audit and order history.`,
                                )
                              ) {
                                mutations.archive.mutate(restaurant.id);
                              }
                            },
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
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            totalItems={data.pagination.total}
            pageSize={data.pagination.pageSize}
            itemLabel="restaurants"
            onPageChange={setPage}
          />
        </Card>
      </div>
    </div>
  );
}

export function PlatformRestaurantDetails({ id }: { id: string }) {
  return <RestaurantDetailsScreen id={id} />;
}

export function PlatformAdministrations() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const query = useAdministrations({
    page,
    pageSize: 20,
    search: search || undefined,
  });
  const mutations = useAdministrationMutations();
  if (query.isLoading) return <PageLoading />;
  if (query.isError || !query.data)
    return <ErrorState message="Unable to load administrators." />;
  const data = query.data;
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="type-page-title">Administrators</h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              Manage team members, access roles, and platform permissions.
            </p>
          </div>
          <Link
            href="/administrations/invite"
            className="inline-flex h-10 items-center rounded-[var(--radius)] bg-primary px-4 text-sm font-semibold text-white"
          >
            + Invite Administrator
          </Link>
        </div>
        <Card className="overflow-hidden">
          <div className="border-b bg-surface-low p-4">
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="h-9 w-full sm:w-80"
              placeholder="Search administrators..."
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="border-b bg-surface-high text-muted-foreground">
                <tr>
                  {[
                    "Administrator",
                    "Role",
                    "Restaurants",
                    "Status",
                    "Last Login",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} className="type-table-header px-6 py-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.items.map((admin) => (
                  <tr key={admin.id} className="hover:bg-muted">
                    <td className="px-6 py-4">
                      <Link
                        href={`/administrations/${admin.id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {admin.name}
                      </Link>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {admin.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-body-sm">{admin.role}</td>
                    <td className="px-6 py-4 text-body-sm text-muted-foreground">
                      {admin.restaurantIds.length}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-xs font-semibold",
                          admin.status === "ACTIVE"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {admin.lastLoginAt
                        ? new Date(admin.lastLoginAt).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <RowActionsMenu
                        label={admin.name}
                        actions={[
                          {
                            label: "View",
                            href: `/administrations/${admin.id}`,
                          },
                          {
                            label:
                              admin.status === "ACTIVE"
                                ? "Deactivate"
                                : "Activate",
                            onSelect: () =>
                              mutations.status.mutate({
                                id: admin.id,
                                status:
                                  admin.status === "ACTIVE"
                                    ? "SUSPENDED"
                                    : "ACTIVE",
                              }),
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
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            totalItems={data.pagination.total}
            pageSize={data.pagination.pageSize}
            itemLabel="administrators"
            onPageChange={setPage}
          />
        </Card>
      </div>
    </div>
  );
}

export function PlatformAdministrationDetails({ id }: { id: string }) {
  const query = useAdministration(id);
  if (query.isLoading) return <PageLoading />;
  if (query.isError || !query.data)
    return <ErrorState message="Unable to load administrator details." />;
  const admin = query.data;
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <Link
          href="/administrations"
          className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary"
        >
          ← Back to Administrators
        </Link>
        <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="type-label-caps text-primary">
              Administrator profile
            </p>
            <h1 className="type-display mt-2">{admin.name}</h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              {admin.email}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              admin.status === "ACTIVE"
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {admin.status}
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-body-sm">
              <p>
                <strong>Phone:</strong> {admin.phone ?? "—"}
              </p>
              <p>
                <strong>Role:</strong> {admin.role}
              </p>
              <p>
                <strong>Restaurants:</strong> {admin.restaurantIds.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {admin.permissions.map((permission) => (
                <span
                  key={permission}
                  className="rounded bg-surface-high px-2 py-1 text-xs"
                >
                  {permission}
                </span>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
