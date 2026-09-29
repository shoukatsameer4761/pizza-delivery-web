"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { restaurantsApi } from "@/lib/api/restaurants";
import { ApiError } from "@/lib/api/client";
import { useRestaurant } from "@/hooks/use-platform";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CreateRestaurantRequest } from "@/types/restaurants";

type FormValues = Required<CreateRestaurantRequest>;
const defaults: FormValues = {
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
};
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
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
  } = useForm<FormValues>({ defaultValues: defaults });
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
      id="restaurant-form"
      className="space-y-6"
      onSubmit={handleSubmit(submit)}
    >
      <section className="rounded-lg border bg-surface-lowest p-5">
        <h2 className="mb-4 text-lg font-bold">Basic information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Restaurant name">
            <Input
              {...register("name", { required: true })}
              placeholder="Northside Gourmet Pizza"
            />
          </Field>
          <Field label="Slug">
            <Input
              {...register("slug", {
                required: true,
                pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              })}
              placeholder="northside-pizza"
            />
          </Field>
          <Field label="Cuisine">
            <Input {...register("cuisine", { required: true })} />
          </Field>
          <Field label="Currency">
            <select
              className="h-10 rounded border bg-surface-lowest px-3"
              {...register("currency")}
            >
              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </Field>
        </div>
      </section>
      <section className="rounded-lg border bg-surface-lowest p-5">
        <h2 className="mb-4 text-lg font-bold">Contact and location</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone">
            <Input {...register("phone", { required: true })} />
          </Field>
          <Field label="Email">
            <Input type="email" {...register("email", { required: true })} />
          </Field>
          <Field label="Support contact">
            <Input {...register("supportContact")} />
          </Field>
          <Field label="Postal code">
            <Input {...register("postalCode", { required: true })} />
          </Field>
          <Field label="Address">
            <Input {...register("address", { required: true })} />
          </Field>
          <Field label="City">
            <Input {...register("city", { required: true })} />
          </Field>
        </div>
      </section>
      <section className="rounded-lg border bg-surface-lowest p-5">
        <h2 className="mb-4 text-lg font-bold">Operations</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Tax rate (%)">
            <Input
              type="number"
              step="0.1"
              {...register("taxRate", {
                valueAsNumber: true,
                min: 0,
                max: 100,
              })}
            />
          </Field>
          <Field label="Delivery radius (km)">
            <Input
              type="number"
              step="0.1"
              {...register("deliveryRadius", { valueAsNumber: true, min: 0 })}
            />
          </Field>
          <label className="flex items-center gap-2 pt-7 text-sm font-medium">
            <input type="checkbox" {...register("autoAccept")} /> Auto-accept
            orders
          </label>
        </div>
      </section>
      <div className="flex justify-end gap-3">
        <Link
          href={restaurantId ? `/restaurants/${restaurantId}` : "/restaurants"}
          className="inline-flex h-10 items-center rounded border px-4 text-sm font-semibold"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : restaurantId
              ? "Save changes"
              : "Create restaurant"}
        </Button>
      </div>
    </form>
  );
}
