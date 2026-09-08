"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Grid2X2,
  MoreVertical,
  Pencil,
  Receipt,
  RotateCcw,
  Search,
  Star,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

type Customer = {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spend: string;
  lastOrder: string;
  orderId: string;
  segment: "VIP" | "Repeat" | "New" | "Standard";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
};
const customers: Customer[] = [
  {
    id: "#CUST-1048",
    initials: "AK",
    name: "Ahmed Khan",
    phone: "+92 300 1234567",
    email: "ahmed.khan@email.com",
    orders: 18,
    spend: "Rs. 48,920",
    lastOrder: "Today, 12:42 PM",
    orderId: "#10482",
    segment: "VIP",
    status: "ACTIVE",
  },
  {
    id: "#CUST-1049",
    initials: "SA",
    name: "Sara Ali",
    phone: "+92 321 4567890",
    email: "sara.ali@email.com",
    orders: 12,
    spend: "Rs. 31,450",
    lastOrder: "Today, 11:15 AM",
    orderId: "#10485",
    segment: "Repeat",
    status: "ACTIVE",
  },
  {
    id: "#CUST-1050",
    initials: "HM",
    name: "Hamza Malik",
    phone: "+92 300 9876543",
    email: "h.malik@outlook.com",
    orders: 3,
    spend: "Rs. 8,240",
    lastOrder: "Yesterday",
    orderId: "#10478",
    segment: "Standard",
    status: "ACTIVE",
  },
  {
    id: "#CUST-1032",
    initials: "UT",
    name: "Usman Tariq",
    phone: "+92 333 7891234",
    email: "usman.t@gmail.com",
    orders: 24,
    spend: "Rs. 64,800",
    lastOrder: "2 days ago",
    orderId: "#10460",
    segment: "VIP",
    status: "ACTIVE",
  },
  {
    id: "#CUST-1051",
    initials: "BS",
    name: "Bilal Sheikh",
    phone: "+92 345 6789012",
    email: "bilal.sheikh@live.com",
    orders: 1,
    spend: "Rs. 1,650",
    lastOrder: "3 days ago",
    orderId: "#10452",
    segment: "New",
    status: "ACTIVE",
  },
  {
    id: "#CUST-1038",
    initials: "FN",
    name: "Fatima Noor",
    phone: "+92 312 3456789",
    email: "fatima.noor@domain.com",
    orders: 7,
    spend: "Rs. 18,900",
    lastOrder: "1 week ago",
    orderId: "#10410",
    segment: "Repeat",
    status: "ACTIVE",
  },
  {
    id: "#CUST-1025",
    initials: "ZO",
    name: "Zayd Omer",
    phone: "+92 301 2345678",
    email: "zayd.omer@cloud.com",
    orders: 5,
    spend: "Rs. 14,200",
    lastOrder: "2 weeks ago",
    orderId: "#10380",
    segment: "Standard",
    status: "INACTIVE",
  },
  {
    id: "#CUST-1012",
    initials: "AS",
    name: "Ayesha Siddiqui",
    phone: "+92 322 8765432",
    email: "ayesha.s@gmail.com",
    orders: 2,
    spend: "Rs. 4,100",
    lastOrder: "1 month ago",
    orderId: "#10290",
    segment: "Standard",
    status: "BLOCKED",
  },
];

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative inline-flex items-center gap-1.5 rounded bg-surface-low px-3 py-1.5 text-xs font-medium">
      <span className="text-[11px] text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none bg-transparent pr-4 outline-none"
      >
        <option>All</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-muted-foreground" />
    </label>
  );
}

function StatusBadge({ status }: { status: Customer["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        status === "ACTIVE"
          ? "bg-success/10 text-success"
          : status === "BLOCKED"
            ? "bg-destructive/10 text-destructive"
            : "bg-surface-high text-muted-foreground",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function CustomersListScreen() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [segment, setSegment] = useState("All");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const filtered = useMemo(
    () =>
      customers.filter(
        (customer) =>
          `${customer.name} ${customer.phone} ${customer.email}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === "All" || customer.status === status) &&
          (segment === "All" || customer.segment === segment),
      ),
    [query, segment, status],
  );
  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const reset = () => {
    setQuery("");
    setStatus("All");
    setSegment("All");
  };
  const toggleSelected = (id: string) =>
    setSelected((ids) =>
      ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
    );
  return (
    <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 font-medium hover:text-primary"
              >
                <Grid2X2 className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <span>›</span>
              <span className="font-semibold text-foreground">Customers</span>
            </nav>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                Customers
                <span className="rounded-full bg-surface-high px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  Pizza House
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage patron records, ordering habits, address books, and
                loyalty tiers for Pizza House.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => notify("Customer export prepared")}
              className="inline-flex items-center gap-2 rounded bg-surface-lowest px-3.5 py-2 text-xs font-semibold shadow-sm hover:bg-surface-low"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => notify("Customer creation form opened")}
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-container"
            >
              <UserPlus className="h-4 w-4" />+ Add Customer
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [
              "Total Patrons",
              "1,420",
              "+12%",
              "vs last month",
              Users,
              "text-primary",
            ],
            [
              "Active (90d)",
              "1,288",
              "90.7%",
              "ordered in last 90 days",
              Zap,
              "text-success",
            ],
            [
              "New Customers",
              "142",
              "First order this month",
              "+8 today",
              UserPlus,
              "text-muted-foreground",
            ],
            [
              "VIP / Repeat",
              "614",
              "43.2%",
              "repeat retention rate",
              Star,
              "text-primary",
            ],
          ].map(([title, value, change, detail, Icon, color]) => {
            const MetricIcon = Icon as typeof Users;
            return (
              <Card
                key={title as string}
                className="relative overflow-hidden p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="type-label-caps text-muted-foreground">
                      {title as string}
                    </span>
                    <div className="mt-1 text-2xl font-bold">
                      {value as string}
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-surface-low">
                    <MetricIcon
                      className={cn("h-4.5 w-4.5", color as string)}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px]">
                  <span className={cn("font-semibold", color as string)}>
                    {change as string}
                  </span>
                  <span className="text-muted-foreground">
                    {detail as string}
                  </span>
                </div>
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 opacity-20",
                    color === "text-success" ? "bg-success" : "bg-primary",
                  )}
                />
              </Card>
            );
          })}
        </div>
        <Card className="space-y-3 p-4 shadow-sm">
          <div className="flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-9 border-0 bg-surface-low pl-9 text-xs"
                placeholder="Search by customer name, phone, or email..."
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-surface-high px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                label="Status"
                value={status}
                options={["ACTIVE", "INACTIVE", "BLOCKED"]}
                onChange={setStatus}
              />
              <FilterSelect
                label="Type"
                value={segment}
                options={["VIP", "Repeat", "New", "Standard"]}
                onChange={setSegment}
              />
              <FilterSelect
                label="Orders"
                value="All"
                options={["1 order", "2-5 orders", "6+ orders"]}
                onChange={() => undefined}
              />
              <button
                type="button"
                onClick={() => notify("More customer filters opened")}
                className="inline-flex items-center gap-1 rounded bg-surface-low px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-surface-high"
              >
                <Filter className="h-4 w-4" />
                More Filters
              </button>
              <button
                type="button"
                disabled={selected.length === 0}
                className="rounded bg-surface-high px-3 py-1.5 text-xs font-medium text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                Bulk Actions <ChevronDown className="ml-1 inline h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded p-1.5 text-muted-foreground hover:bg-surface-high"
                aria-label="Reset filters"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pt-2 text-xs">
            <span className="type-label-caps mr-1 text-muted-foreground">
              View:
            </span>
            {[
              ["All", "1,420"],
              ["VIP / Repeat", "614"],
              ["Active Orders", "18"],
              ["Inactive", "132"],
              ["Blocked", "6"],
            ].map(([label, count]) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (label === "VIP / Repeat") setSegment("VIP");
                  else if (label === "Inactive" || label === "Blocked")
                    setStatus(label.toUpperCase());
                  else {
                    setSegment("All");
                    setStatus("All");
                  }
                }}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold",
                  (label === "All" && segment === "All" && status === "All") ||
                    (label === "VIP / Repeat" && segment === "VIP") ||
                    (label === "Inactive" && status === "INACTIVE") ||
                    (label === "Blocked" && status === "BLOCKED")
                    ? "bg-primary text-white"
                    : "bg-surface-low hover:bg-surface-high",
                )}
              >
                {label === "Active Orders" && (
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-success" />
                )}
                {label} ({count})
              </button>
            ))}
          </div>
        </Card>
        <Card className="overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs">
              <thead className="bg-surface-low text-muted-foreground">
                <tr>
                  <th className="w-10 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === filtered.length &&
                        filtered.length > 0
                      }
                      onChange={() =>
                        setSelected(
                          selected.length === filtered.length
                            ? []
                            : filtered.map((customer) => customer.id),
                        )
                      }
                      className="h-3.5 w-3.5 accent-primary"
                      aria-label="Select all customers"
                    />
                  </th>
                  {[
                    "Customer",
                    "Phone",
                    "Email",
                    "Orders",
                    "Total Spent",
                    "Last Order",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} className="type-table-header px-4 py-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className={cn(
                      "group transition-colors hover:bg-surface-low",
                      customer.status === "BLOCKED" && "bg-destructive/5",
                      customer.status === "INACTIVE" && "opacity-80",
                    )}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(customer.id)}
                        onChange={() => toggleSelected(customer.id)}
                        className="h-3.5 w-3.5 accent-primary"
                        aria-label={`Select ${customer.name}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold",
                            customer.status === "BLOCKED"
                              ? "bg-destructive/10 text-destructive"
                              : customer.segment === "VIP"
                                ? "bg-primary/10 text-primary"
                                : "bg-surface-high text-muted-foreground",
                          )}
                        >
                          {customer.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "truncate font-semibold",
                                customer.status === "BLOCKED" && "line-through",
                              )}
                            >
                              {customer.name}
                            </span>
                            {customer.segment !== "Standard" && (
                              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                {customer.segment}
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {customer.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono">
                      {customer.phone}
                    </td>
                    <td className="max-w-[170px] truncate px-4 py-3 font-mono text-[11px] text-muted-foreground">
                      {customer.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">
                        {customer.orders}{" "}
                        {customer.orders === 1 ? "order" : "orders"}
                      </span>
                      <div className="mt-1 flex h-1 w-10 gap-0.5">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <span
                            key={bar}
                            className={cn(
                              "flex-1 rounded bg-success",
                              bar > Math.min(customer.orders, 5) / 4 &&
                                "bg-surface-high",
                            )}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold">
                      {customer.spend}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="font-medium">{customer.lastOrder}</div>
                      <Link
                        href={`/orders/${customer.orderId.replace("#", "")}`}
                        className="font-mono text-[10px] text-primary hover:underline"
                      >
                        {customer.orderId}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="relative px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === customer.id ? null : customer.id,
                          )
                        }
                        className="rounded p-1 text-muted-foreground hover:bg-surface-high"
                        aria-label={`Actions for ${customer.name}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {openMenu === customer.id && (
                        <div className="absolute right-4 z-20 mt-1 w-44 rounded border bg-surface-lowest py-1 text-left shadow-md">
                          <Link
                            href={`/customers/${customer.id.replace("#CUST-", "")}`}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-surface-low"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              notify(`Edit form opened for ${customer.name}`)
                            }
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-surface-low"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Customer
                          </button>
                          <Link
                            href={`/customers/${customer.id.replace("#CUST-", "")}/orders`}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-surface-low"
                          >
                            <Receipt className="h-3.5 w-3.5" />
                            View Orders
                          </Link>
                          <div className="my-1 border-t" />
                          <button
                            type="button"
                            onClick={() =>
                              notify(
                                customer.status === "BLOCKED"
                                  ? "Unblock request submitted"
                                  : "Customer deactivation request submitted",
                              )
                            }
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                          >
                            {customer.status === "BLOCKED" ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                            {customer.status === "BLOCKED"
                              ? "Unblock"
                              : "Deactivate"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 bg-surface-low p-4 text-xs text-muted-foreground sm:flex-row">
            <span>
              Showing <b className="text-foreground">1-{filtered.length}</b> of{" "}
              <b className="text-foreground">1,420</b> customers
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="rounded px-2.5 py-1.5 disabled:opacity-40"
              >
                Previous
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    "h-7 w-7 rounded",
                    page === 1
                      ? "bg-primary text-white"
                      : "hover:bg-surface-high",
                  )}
                >
                  {page}
                </button>
              ))}
              <span>...</span>
              <button
                type="button"
                className="h-7 w-7 rounded hover:bg-surface-high"
              >
                178
              </button>
              <button
                type="button"
                className="rounded px-2.5 py-1.5 hover:bg-surface-high"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
        {notice && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-inverse-surface px-4 py-3 text-xs font-semibold text-white shadow-xl">
            {notice}
          </div>
        )}
      </div>
    </div>
  );
}
