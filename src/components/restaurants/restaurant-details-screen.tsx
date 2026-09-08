"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ErrorState, PageLoading } from "@/components/shared/states";
import { Card } from "@/components/ui/card";
import { useDashboardOverview, useRestaurant } from "@/hooks/use-platform";
import { useRestaurant as useRestaurantContext } from "@/providers/restaurant-provider";
import { cn } from "@/lib/utils/cn";

type RestaurantDetailsScreenProps = { id: string };

const contextLinks = [
  { label: "Restaurant Dashboard", detail: "Live performance and health", href: "/restaurant-dashboard", icon: BarChart3 },
  { label: "Orders", detail: "Review and manage order flow", href: "/orders", icon: ReceiptText },
  { label: "Menu", detail: "Manage items and availability", href: "/menu", icon: Store },
  { label: "Categories", detail: "Organize the restaurant menu", href: "/categories", icon: Building2 },
  { label: "Toppings & Extras", detail: "Maintain modifiers and add-ons", href: "/toppings", icon: Settings2 },
  { label: "Customers", detail: "Inspect customer activity", href: "/customers", icon: Users },
  { label: "Coupons", detail: "Review local promotions", href: "/coupons", icon: Wallet },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function displayValue(value: string | number | null | undefined) {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

export function RestaurantDetailsScreen({ id }: RestaurantDetailsScreenProps) {
  const restaurantQuery = useRestaurant(id);
  const overviewQuery = useDashboardOverview({ restaurantId: id });
  const { setSelectedRestaurant } = useRestaurantContext();

  if (restaurantQuery.isLoading) return <PageLoading />;
  if (restaurantQuery.isError || !restaurantQuery.data) {
    return <ErrorState message="Unable to load restaurant details." />;
  }

  const restaurant = restaurantQuery.data;
  const overview = overviewQuery.data;
  const workspaceHref = (href: string) => `${href}?restaurantId=${encodeURIComponent(id)}`;
  const contactFields: Array<{ label: string; value: string; icon: LucideIcon }> = [
    { label: "Street Address", value: displayValue(restaurant.address), icon: MapPin },
    { label: "City / Region", value: displayValue(restaurant.city), icon: Building2 },
    { label: "Primary Phone", value: displayValue(restaurant.phone), icon: Phone },
    { label: "Support Email", value: displayValue(restaurant.email ?? restaurant.supportContact), icon: Mail },
  ];
  const statusClass =
    restaurant.status === "ACTIVE"
      ? "bg-success/10 text-success"
      : restaurant.status === "SUSPENDED"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";

  return (
    <div className="h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/restaurants" className="hover:text-primary">Restaurants</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-foreground">{restaurant.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", statusClass)}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {restaurant.status === "ACTIVE" ? "Active status" : restaurant.status}
            </span>
            <span className="rounded bg-surface-high px-2.5 py-1 font-mono text-xs text-muted-foreground">ID: {restaurant.id}</span>
          </div>
        </div>

        <Card className="flex flex-col justify-between gap-6 p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-3xl font-bold text-primary shadow-inner">
              {initials(restaurant.name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="type-display">{restaurant.name}</h1>
                <span className="rounded bg-surface-high px-2.5 py-0.5 font-mono text-xs text-muted-foreground">slug: {restaurant.slug}</span>
              </div>
              <p className="mt-1 text-body-reg text-muted-foreground">{restaurant.cuisine ?? "Restaurant operations"}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" /> Daily operations</span>
                <span className="flex items-center gap-1"><Globe2 className="h-4 w-4" /> {restaurant.city ?? "Location pending"}</span>
                <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Created {new Date(restaurant.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-[var(--radius)] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-container">
              <Edit3 className="h-4 w-4" /> Edit Restaurant
            </button>
            <Link href={`/administrations?restaurantId=${encodeURIComponent(id)}`} className="inline-flex h-10 items-center gap-2 rounded-[var(--radius)] bg-surface-high px-4 text-sm font-semibold hover:bg-surface-highest">
              <Users className="h-4 w-4" /> Administrators
            </Link>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Orders", value: overview?.orders.value.toLocaleString() ?? "—", detail: "Current restaurant scope", icon: ReceiptText, tone: "bg-primary-fixed text-primary" },
            { label: "Total Revenue", value: overview ? `${overview.revenue.currency} ${overview.revenue.value.toLocaleString()}` : "—", detail: "Current restaurant scope", icon: Wallet, tone: "bg-tertiary-fixed text-tertiary" },
            { label: "Customers", value: overview?.customers.value.toLocaleString() ?? "—", detail: "Registered customer activity", icon: Users, tone: "bg-surface-high text-foreground" },
            { label: "Restaurant Status", value: restaurant.status, detail: `${restaurant.autoAccept ? "Auto-accept enabled" : "Manual order acceptance"}`, icon: ShieldCheck, tone: "bg-secondary-fixed text-secondary" },
          ].map(({ label, value, detail, icon: Icon, tone }) => (
            <Card key={label} className="p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="type-label-caps text-muted-foreground">{label}</span>
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", tone)}><Icon className="h-[18px] w-[18px]" /></span>
              </div>
              <div className="mt-4 text-2xl font-bold tracking-tight">{value}</div>
              <div className="mt-2 text-xs text-muted-foreground">{detail}</div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="p-6 lg:col-span-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="type-section-title">Location &amp; Contact Information</h2>
              <button type="button" className="text-xs font-semibold text-primary hover:underline">Update Location</button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {contactFields.map(({ label, value, icon: FieldIcon }) => <div key={label} className="space-y-1"><span className="type-label-caps text-muted-foreground">{label}</span><p className="flex items-start gap-2 text-sm font-medium"><FieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{value}</p></div>)}
            </div>
            <div className="mt-6 flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> Delivery radius: {restaurant.deliveryRadius} km</div>
          </Card>

          <Card className="p-6 lg:col-span-5">
            <div className="mb-5 flex items-center justify-between gap-3"><h2 className="type-section-title">Operational Configuration</h2><button type="button" className="text-xs font-semibold text-primary hover:underline">Configure</button></div>
            <div className="space-y-1">
              {[
                ["Auto-Accept Orders", restaurant.autoAccept ? "Yes (Active)" : "Disabled", restaurant.autoAccept],
                ["Tax Rate", `${restaurant.taxRate}%`, undefined],
                ["Currency", restaurant.currency, undefined],
                ["Delivery Radius", `${restaurant.deliveryRadius} km`, undefined],
              ].map(([label, value, positive]) => <div key={String(label)} className="flex items-center justify-between gap-3 border-b py-3 last:border-0"><span className="text-sm font-medium">{label}</span>{positive !== undefined ? <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">{value}</span> : <span className="font-mono text-sm font-semibold">{value}</span>}</div>)}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-success"><CheckCircle2 className="h-4 w-4" /> Configuration is synced with this restaurant</div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h2 className="type-section-title">Restaurant Workspace</h2><p className="mt-1 text-xs text-muted-foreground">Open operational tools in the context of {restaurant.name}.</p></div><span className="rounded bg-primary/10 px-2.5 py-1 font-mono text-xs text-primary">SUPER ADMIN CONTEXT</span></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {contextLinks.map(({ label, detail, href, icon: Icon }) => <Link key={label} href={workspaceHref(href)} onClick={() => setSelectedRestaurant(id)} className="group rounded-lg border bg-surface-low p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"><div className="flex items-start justify-between gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-high text-primary"><Icon className="h-4 w-4" /></span><ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" /></div><p className="mt-3 text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></Link>)}
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="p-6 lg:col-span-8"><div className="mb-4 flex items-center justify-between"><div><h2 className="type-section-title">Recent Activity Overview</h2><p className="mt-1 text-xs text-muted-foreground">Restaurant-scoped activity from the platform dashboard.</p></div><Link href={workspaceHref("/orders")} onClick={() => setSelectedRestaurant(id)} className="text-xs font-semibold text-primary hover:underline">View Orders</Link></div>{overviewQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading activity…</p> : overview?.recentActivity.length ? <div className="space-y-3">{overview.recentActivity.slice(0, 4).map((activity) => <div key={activity.id} className="flex items-start gap-3 rounded-lg bg-surface-low p-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-tertiary"><BarChart3 className="h-3.5 w-3.5" /></span><div><p className="text-sm font-medium">{activity.message}</p><p className="mt-0.5 text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</p></div></div>)}</div> : <p className="rounded-lg bg-surface-low p-4 text-sm text-muted-foreground">No recent activity for this restaurant.</p>}</Card>
          <Card className="p-6 lg:col-span-4"><div className="mb-4 flex items-center justify-between"><h2 className="type-section-title">Access Scope</h2><ShieldCheck className="h-5 w-5 text-tertiary" /></div><div className="rounded-lg bg-surface-low p-4"><p className="text-sm font-semibold">Super Admin visibility</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">You are viewing one tenant. Workspace links preserve this restaurant context so operational data stays scoped to {restaurant.name}.</p></div><Link href="/restaurants" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Back to Restaurants</Link></Card>
        </div>
      </div>
    </div>
  );
}
