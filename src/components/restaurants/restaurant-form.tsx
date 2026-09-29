"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { restaurantsApi } from "@/lib/api/restaurants";
import { ApiError } from "@/lib/api/client";
import { useRestaurant } from "@/hooks/use-platform";
import type { CreateRestaurantRequest } from "@/types/restaurants";

type FormValues = Required<CreateRestaurantRequest>;
const sections = [
  {
    number: "1",
    title: "Basic Information",
    description: "General identifiers and cuisine classification",
  },
  {
    number: "2",
    title: "Contact & Operations",
    description: "Primary communication channels for management",
  },
  {
    number: "3",
    title: "Location & Address",
    description: "Physical establishment coordinates for mapping & delivery",
  },
  {
    number: "4",
    title: "Operational Configuration",
    description: "Financials, delivery parameters, and fulfillment logic",
  },
];
function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "space-y-1 md:col-span-2" : "space-y-1"}>
      <span className="type-label-caps block text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border bg-surface-lowest p-5">
      <div className="mb-5 flex items-center gap-3 border-b pb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-primary/10 text-sm font-bold text-primary">
          {number}
        </span>
        <div>
          <h2 className="type-card-title">{title}</h2>
          <p className="text-body-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function RestaurantForm({ restaurantId }: { restaurantId?: string }) {
  const router = useRouter();
  const existing = useRestaurant(restaurantId ?? "");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      slug: "",
      cuisine: "Pizza & Italian",
      phone: "",
      email: "",
      supportContact: "",
      address: "",
      city: "",
      postalCode: "",
      currency: "PKR",
      taxRate: 16,
      deliveryRadius: 8,
      autoAccept: true,
    },
  });
  useEffect(() => {
    if (!existing.data) return;
    reset({
      name: existing.data.name,
      slug: existing.data.slug,
      cuisine: existing.data.cuisine ?? "Pizza & Italian",
      phone: existing.data.phone ?? "",
      email: existing.data.email ?? "",
      supportContact: existing.data.supportContact ?? "",
      address: existing.data.address ?? "",
      city: existing.data.city ?? "",
      postalCode: existing.data.postalCode ?? "",
      currency: existing.data.currency as FormValues["currency"],
      taxRate: existing.data.taxRate,
      deliveryRadius: existing.data.deliveryRadius,
      autoAccept: existing.data.autoAccept,
    });
  }, [existing.data, reset]);
  const submit = async (values: FormValues) => {
    try {
      const result = restaurantId
        ? await restaurantsApi.update(restaurantId, values)
        : await restaurantsApi.create(values);
      router.push(`/restaurants/${result.id}`);
      router.refresh();
    } catch (reason: unknown) {
      window.alert(
        reason instanceof ApiError ? reason.code : "Unable to save restaurant",
      );
    }
  };
  if (restaurantId && existing.isLoading)
    return <p className="text-sm text-muted-foreground">Loading restaurant…</p>;
  if (restaurantId && existing.isError)
    return (
      <p className="text-sm text-destructive">
        Unable to load restaurant details.
      </p>
    );
  return (
    <form
      id="create-restaurant-form"
      className="space-y-6"
      onSubmit={handleSubmit(submit)}
    >
      <Section {...sections[0]}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Restaurant Name" wide>
            <Input
              {...register("name", { required: true })}
              placeholder="e.g. Northside Gourmet Pizza"
              required
            />
          </Field>
          <Field label="Slug / Handle">
            <div className="flex h-10 items-center rounded-[var(--radius)] border bg-surface-low">
              <span className="pl-3 text-xs text-muted-foreground">
                prokitchen.io/
              </span>
              <input
                className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
                {...register("slug", {
                  required: true,
                  pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                })}
                placeholder="northside-pizza"
                required
              />
            </div>
          </Field>
          <Field label="Cuisine Type">
            <select
              className="h-10 w-full rounded-[var(--radius)] border bg-surface-lowest px-3 text-sm"
              {...register("cuisine", { required: true })}
            >
              <option>Pizza & Italian</option>
              <option>Fast Casual</option>
              <option>Bakery & Cafe</option>
              <option>Desi & Traditional</option>
              <option>Asian Fusion</option>
            </select>
          </Field>
        </div>
      </Section>
      <Section {...sections[1]}>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Primary Phone Number">
            <Input
              {...register("phone", { required: true })}
              type="tel"
              placeholder="+92 300 1234567"
              required
            />
          </Field>
          <Field label="Business Email">
            <Input
              {...register("email", { required: true })}
              type="email"
              placeholder="orders@northside.com"
              required
            />
          </Field>
          <Field label="Support Contact Name">
            <Input {...register("supportContact")} placeholder="Ali Khan" />
          </Field>
        </div>
      </Section>
      <Section {...sections[2]}>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Street Address" wide>
            <Input
              {...register("address", { required: true })}
              placeholder="Shop 4, Commercial Sector C, Main Boulevard"
              required
            />
          </Field>
          <Field label="City / Area" wide>
            <Input
              {...register("city", { required: true })}
              placeholder="Lahore, DHA Phase 6"
              required
            />
          </Field>
          <Field label="Postal Code">
            <Input
              {...register("postalCode", { required: true })}
              placeholder="54000"
              required
            />
          </Field>
        </div>
      </Section>
      <Section {...sections[3]}>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Currency">
            <select
              className="h-10 w-full rounded-[var(--radius)] border bg-surface-lowest px-3 text-sm"
              {...register("currency")}
            >
              <option value="PKR">PKR - Pakistani Rupee (Rs.)</option>
              <option value="USD">USD - US Dollar ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="GBP">GBP - Pound Sterling (£)</option>
            </select>
          </Field>
          <Field label="Tax Rate (%)">
            <Input
              {...register("taxRate", {
                valueAsNumber: true,
                min: 0,
                max: 100,
              })}
              type="number"
              step="0.1"
            />
          </Field>
          <Field label="Default Delivery Radius (km)">
            <Input
              {...register("deliveryRadius", { valueAsNumber: true, min: 0 })}
              type="number"
            />
          </Field>
        </div>
        <label className="mt-5 flex items-center justify-between rounded-[var(--radius)] border bg-surface-low p-4">
          <span>
            <span className="block text-sm font-semibold">
              Order Auto-Accept
            </span>
            <span className="text-body-sm text-muted-foreground">
              Automatically accept incoming orders when kitchen load is normal.
            </span>
          </span>
          <input
            type="checkbox"
            className="h-5 w-5 rounded-[var(--radius-sm)] text-primary focus:ring-primary"
            {...register("autoAccept")}
          />
        </label>
      </Section>
      {restaurantId && (
        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
