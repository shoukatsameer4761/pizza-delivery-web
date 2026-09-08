"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CircleUserRound,
  Info,
  LayoutDashboard,
  Plus,
  Settings,
  Shield,
  ShoppingBag,
  Store,
  Ticket,
  Wheat,
  UserCog,
  Users,
  Utensils,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { canAny, hasRole } from "@/lib/permissions";
import { cn } from "@/lib/utils/cn";
import { useRestaurant as useRestaurantDetails } from "@/hooks/use-platform";
import { useAuth } from "@/providers/auth-provider";
import { useRestaurant } from "@/providers/restaurant-provider";

const items = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN"] as const,
  },
  {
    label: "Restaurant Dashboard",
    href: "/restaurant-dashboard",
    icon: Store,
    permissions: ["restaurant.dashboard.read"],
    roles: ["RESTAURANT_ADMIN", "RESTAURANT_STAFF"] as const,
  },
  {
    label: "Restaurants",
    href: "/restaurants",
    icon: Store,
    roles: ["SUPER_ADMIN"] as const,
    permissions: ["restaurants.read"],
  },
  {
    label: "Administrators",
    href: "/administrations",
    icon: Users,
    roles: ["SUPER_ADMIN"] as const,
    permissions: ["administrations.read"],
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingBag,
    roles: ["RESTAURANT_ADMIN", "RESTAURANT_STAFF"] as const,
    permissions: ["orders.read"],
  },
  {
    label: "Menu",
    href: "/menu",
    icon: Utensils,
    roles: ["RESTAURANT_ADMIN", "RESTAURANT_STAFF"] as const,
    permissions: ["menu.read"],
  },
  {
    label: "Toppings & Extras",
    href: "/toppings",
    icon: Wheat,
    roles: ["RESTAURANT_ADMIN", "RESTAURANT_STAFF"] as const,
    permissions: ["toppings.read"],
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Utensils,
    roles: ["RESTAURANT_ADMIN", "RESTAURANT_STAFF"] as const,
    permissions: ["categories.read"],
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
    roles: ["RESTAURANT_ADMIN"] as const,
    permissions: ["customers.read"],
  },
  {
    label: "Coupons",
    href: "/coupons",
    icon: Ticket,
    roles: ["RESTAURANT_ADMIN"] as const,
    permissions: ["coupons.read"],
  },
  {
    label: "Reports & Analytics",
    href: "/reports",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "RESTAURANT_ADMIN"] as const,
    permissions: ["reports.read"],
    children: [
      { label: "Executive Overview", href: "/reports" },
      { label: "Revenue & Fleet", href: "/reports/revenue-fleet" },
      { label: "Orders & Delivery", href: "/reports/orders-delivery" },
      { label: "Menu Economics", href: "/reports/menu-economics" },
    ],
  },
  {
    label: "Staff",
    href: "/staff",
    icon: UserCog,
    roles: ["RESTAURANT_ADMIN"] as const,
    permissions: ["staff.read"],
    children: [
      { label: "Staff Directory", href: "/staff" },
      { label: "Security Governance", href: "/staff/security-governance" },
    ],
  },
  {
    label: "Audit Logs",
    href: "/audit-logs",
    icon: Shield,
    roles: ["SUPER_ADMIN"] as const,
    permissions: ["audit-logs.read"],
  },
  {
    label: "Settings",
    href: "/restaurant-dashboard/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "RESTAURANT_ADMIN", "RESTAURANT_STAFF"] as const,
    permissions: ["restaurant.settings.read", "settings.read"],
  },
];

type SidebarProps = { open?: boolean; onClose?: () => void };

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { setSelectedRestaurant } = useRestaurant();
  const [collapsed, setCollapsed] = useState(false);
  const restaurantId =
    user?.role === "SUPER_ADMIN"
      ? (pathname.match(/^\/restaurants\/([^/]+)$/)?.[1] ??
        searchParams.get("restaurantId") ??
        undefined)
      : undefined;
  const restaurantContextItems = restaurantId
    ? [
        {
          label: "Restaurant Dashboard",
          href: `/restaurant-dashboard?restaurantId=${restaurantId}`,
          icon: Store,
          roles: ["SUPER_ADMIN"] as const,
          permissions: ["restaurant.dashboard.read"],
        },
        {
          label: "Orders",
          href: `/orders?restaurantId=${restaurantId}`,
          icon: ShoppingBag,
          roles: ["SUPER_ADMIN"] as const,
          permissions: ["orders.read"],
        },
        {
          label: "Menu",
          href: `/menu?restaurantId=${restaurantId}`,
          icon: Utensils,
          roles: ["SUPER_ADMIN"] as const,
          permissions: ["menu.read"],
        },
        {
          label: "Toppings & Extras",
          href: `/toppings?restaurantId=${restaurantId}`,
          icon: Wheat,
          roles: ["SUPER_ADMIN"] as const,
          permissions: ["toppings.read"],
        },
        {
          label: "Categories",
          href: `/categories?restaurantId=${restaurantId}`,
          icon: Utensils,
          roles: ["SUPER_ADMIN"] as const,
          permissions: ["categories.read"],
        },
        {
          label: "Customers",
          href: `/customers?restaurantId=${restaurantId}`,
          icon: Users,
          roles: ["SUPER_ADMIN"] as const,
          permissions: ["customers.read"],
        },
        {
          label: "Coupons",
          href: `/coupons?restaurantId=${restaurantId}`,
          icon: Ticket,
          roles: ["SUPER_ADMIN"] as const,
          permissions: ["coupons.read"],
        },
      ]
    : [];
  const visibleItems = items.filter(
    (item) =>
      (!item.roles || item.roles.some((role) => hasRole(user, role))) &&
      (!item.permissions ||
        !user?.permissionsLoaded ||
        canAny(user, item.permissions)),
  );
  const visibleContextItems = restaurantContextItems.filter(
    (item) =>
      (!item.roles || item.roles.some((role) => hasRole(user, role))) &&
      (!item.permissions ||
        !user?.permissionsLoaded ||
        canAny(user, item.permissions)),
  );
  const restaurantQuery = useRestaurantDetails(restaurantId ?? "");
  useEffect(() => {
    if (restaurantId) setSelectedRestaurant(restaurantId);
  }, [restaurantId, setSelectedRestaurant]);
  const profileHref =
    user?.role === "SUPER_ADMIN"
      ? `/administrations/${user.id}`
      : user?.role === "CUSTOMER"
        ? `/customers/${user.id}`
        : "/restaurant-dashboard/profile";

  const isActive = (href: string) =>
    pathname === href.split("?")[0] ||
    pathname.startsWith(`${href.split("?")[0]}/`);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "admin-sidebar fixed inset-y-0 left-0 z-40 flex shrink-0 -translate-x-full flex-col transition-[width,transform] duration-200 lg:static lg:translate-x-0",
          collapsed ? "w-[260px] lg:w-[76px]" : "w-[260px] lg:w-[260px]",
          open && "translate-x-0",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center justify-between gap-2 border-b border-zinc-700 px-4",
            collapsed && "lg:justify-center lg:px-2",
          )}
        >
          <Image
            src="/assets/logo.png"
            alt="Pro-Kitchen Admin"
            width={52}
            height={52}
            className={cn("h-12 w-12 object-contain", collapsed && "lg:hidden")}
            priority
          />
          <span
            className={cn(
              "text-lg font-semibold whitespace-nowrap",
              collapsed && "lg:hidden",
            )}
          >
            Pizza Admin
          </span>
          <button
            className="hidden rounded p-1 text-zinc-400 hover:bg-zinc-800 lg:block"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
          <button
            className="ml-auto rounded p-1 text-zinc-400 hover:bg-zinc-800 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={() => {
            if (user?.role === "SUPER_ADMIN")
              router.push("/restaurants/create");
          }}
          className={cn(
            "mx-4 mb-4 mt-5 flex h-10 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-container",
            collapsed && "lg:mx-3 lg:px-0",
          )}
          title={
            collapsed
              ? user?.role === "SUPER_ADMIN"
                ? "New Restaurant"
                : "New Order"
              : undefined
          }
        >
          <Plus className="h-4 w-4 shrink-0" />{" "}
          <span className={cn("whitespace-nowrap", collapsed && "lg:hidden")}>
            {user?.role === "SUPER_ADMIN" ? "New Restaurant" : "New Order"}
          </span>
        </button>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4" aria-label="Main navigation">
          {visibleItems.map((item) => {
            const { label, href, icon: Icon } = item;
            const children = "children" in item ? item.children : undefined;
            const active = isActive(href);
            return (
              <div key={href}>
                <Link
                  href={href}
                  onClick={() => {
                    if (restaurantId) setSelectedRestaurant(restaurantId);
                    onClose?.();
                  }}
                  className={cn(
                    "nav-link flex items-center gap-3 px-3 py-2 text-sm",
                    collapsed && "lg:justify-center lg:px-0",
                    active && "active",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />{" "}
                  <span
                    className={cn(
                      "whitespace-nowrap",
                      collapsed && "lg:hidden",
                    )}
                  >
                    {label}
                  </span>
                </Link>
                {children && active && !collapsed && (
                  <div className="ml-7 mt-1 space-y-0.5 border-l border-zinc-700 pl-2">
                    {children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            "block rounded px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white",
                            childActive &&
                              "bg-zinc-800 font-semibold text-white",
                          )}
                          aria-current={childActive ? "page" : undefined}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {restaurantId && visibleContextItems.length > 0 && (
            <div className="mt-5 border-t border-zinc-700 pt-4">
              <div className={cn("mb-2 px-3", collapsed && "lg:px-0 lg:text-center")}>
                <p className={cn("text-[10px] font-bold uppercase tracking-wider text-zinc-500", collapsed && "lg:hidden")}>
                  Restaurant workspace
                </p>
                <p className={cn("mt-1 truncate text-xs font-semibold text-zinc-200", collapsed && "lg:hidden")}>
                  {restaurantQuery.data?.name ?? "Selected restaurant"}
                </p>
                <p className={cn("mt-0.5 truncate font-mono text-[10px] text-zinc-500", collapsed && "lg:hidden")}>
                  {restaurantId}
                </p>
              </div>
              {visibleContextItems.map((item) => {
                const { label, href, icon: Icon } = item;
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => {
                      setSelectedRestaurant(restaurantId);
                      onClose?.();
                    }}
                    className={cn(
                      "nav-link flex items-center gap-3 px-3 py-2 text-sm",
                      collapsed && "lg:justify-center lg:px-0",
                      active && "active",
                    )}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className={cn("whitespace-nowrap", collapsed && "lg:hidden")}>{label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
        <div
          className={cn(
            "space-y-1 border-t border-zinc-700 p-4",
            collapsed && "lg:px-3",
          )}
        >
          <Link
            href={profileHref}
            onClick={onClose}
            className={cn(
              "nav-link flex items-center gap-3 px-3 py-2 text-sm",
              collapsed && "lg:justify-center lg:px-0",
            )}
            title={collapsed ? "My Profile" : undefined}
          >
            <CircleUserRound className="h-5 w-5 shrink-0 text-zinc-400" />
            <span
              className={cn(
                "min-w-0 whitespace-nowrap",
                collapsed && "lg:hidden",
              )}
            >
              <span className="block truncate font-semibold text-zinc-200">
                {user?.name ?? "My Profile"}
              </span>
              <span className="block truncate text-[10px] text-zinc-500">
                {user?.role?.replaceAll("_", " ") ?? "Account settings"}
              </span>
            </span>
          </Link>
          {/* <a
            className="nav-link flex items-center gap-3 px-3 py-2 text-sm"
            href="mailto:support@prokitchen.com"
          >
            <HelpCircle className="h-4 w-4 shrink-0" />{" "}
            <span className={cn("whitespace-nowrap", collapsed && "lg:hidden")}>
              Support
            </span>
          </a> */}
          <span className="flex items-center gap-3 px-4 py-2 text-xs text-zinc-500">
            <Info className="h-4 w-4 shrink-0" />{" "}
            <span className={cn("whitespace-nowrap", collapsed && "lg:hidden")}>
              Version 1.0
            </span>
          </span>
        </div>
      </aside>
    </>
  );
}
