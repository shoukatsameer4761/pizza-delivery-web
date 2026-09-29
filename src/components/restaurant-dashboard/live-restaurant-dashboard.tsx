"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { restaurantDashboardApi } from "@/lib/api/restaurant-dashboard";
import { useRestaurant } from "@/providers/restaurant-provider";
import { useAuth } from "@/providers/auth-provider";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/shared/states";
import type { RestaurantDashboardSummary } from "@/types/restaurant-dashboard";

export function LiveRestaurantDashboard() {
  const {
    selectedRestaurantId,
    availableRestaurants,
    isLoading: restaurantLoading,
  } = useRestaurant();
  const { isLoading: authLoading } = useAuth();
  const [data, setData] = useState<RestaurantDashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedRestaurantId) return;
    let active = true;
    void restaurantDashboardApi
      .overview(selectedRestaurantId)
      .then((result) => {
        if (active) {
          setData(result);
          setError(null);
        }
      })
      .catch((reason: unknown) => {
        if (active)
          setError(
            reason instanceof ApiError
              ? reason.code
              : "Unable to load dashboard",
          );
      });
    return () => {
      active = false;
    };
  }, [selectedRestaurantId]);
  if (authLoading || restaurantLoading)
    return <PageLoading label="Loading restaurant workspace" />;
  if (!selectedRestaurantId)
    return (
      <EmptyDashboard message="No restaurant membership is assigned to this account." />
    );
  if (error)
    return (
      <EmptyDashboard
        message={`Unable to load restaurant dashboard (${error}).`}
      />
    );
  if (!data) return <PageLoading label="Loading restaurant dashboard" />;
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="type-label-caps text-primary">
              {data.restaurant.name} · Restaurant operations
            </p>
            <h1 className="type-page-title mt-2">Restaurant dashboard</h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              Live operational overview for the selected restaurant.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/restaurant-dashboard/settings/availability">
              <Button className="bg-surface-lowest text-foreground hover:bg-surface-high">
                Manage availability
              </Button>
            </Link>
            <Link href="/orders">
              <Button>View live orders</Button>
            </Link>
          </div>
        </div>
        {availableRestaurants.length > 1 && (
          <p className="text-sm text-muted-foreground">
            Restaurant context is selected from the authenticated memberships.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Orders today", data.ordersToday],
            [
              "Revenue today",
              `${data.restaurant.currency} ${data.revenueToday.toLocaleString()}`,
            ],
            [
              "Average order",
              `${data.restaurant.currency} ${data.averageOrderValue.toLocaleString()}`,
            ],
            ["Active customers", data.activeCustomers],
          ].map(([label, value]) => (
            <Card key={String(label)} className="p-5">
              <p className="type-label-caps text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Orders requiring attention</CardTitle>
            </CardHeader>
            <CardContent>
              {data.ordersRequiringAttention.length ? (
                <div className="space-y-3">
                  {data.ordersRequiringAttention.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between rounded border bg-surface-low p-3 text-sm"
                    >
                      <span>
                        {order.id} · {order.itemCount} items
                      </span>
                      <strong>{order.status}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No orders require attention.
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent orders</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentOrders.length ? (
                <div className="space-y-3">
                  {data.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between border-b pb-3 text-sm"
                    >
                      <span>{order.id}</span>
                      <span>{order.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No orders have been recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
function EmptyDashboard({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Card className="max-w-lg">
        <CardContent className="p-8 text-center">
          <h1 className="type-page-title">Restaurant dashboard</h1>
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
