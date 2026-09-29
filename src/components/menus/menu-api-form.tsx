"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorState, PageLoading } from "@/components/shared/states";
import {
  useCategories,
  useMenuItem,
  useMenuMutations,
} from "@/hooks/use-catalog";
import { useRestaurant } from "@/providers/restaurant-provider";
import type {
  MenuItemInput,
  MenuItemStatus,
  MenuSizeInput,
} from "@/types/catalog";

const emptySize = (displayOrder: number): MenuSizeInput => ({
  name: displayOrder === 1 ? "Small" : displayOrder === 2 ? "Medium" : "Large",
  diameterInches: displayOrder === 1 ? 8 : displayOrder === 2 ? 10 : 12,
  slices: displayOrder === 1 ? 4 : displayOrder === 2 ? 6 : 8,
  servingDescription: null,
  priceMinor: displayOrder === 1 ? 79900 : displayOrder === 2 ? 109900 : 129900,
  currency: "PKR",
  isAvailable: true,
  displayOrder,
});

export function MenuApiForm({ id }: { id?: string }) {
  const { selectedRestaurantId } = useRestaurant();
  const existing = useMenuItem(selectedRestaurantId, id ?? "");
  const categories = useCategories(selectedRestaurantId, {
    page: 1,
    pageSize: 100,
    sort: "displayOrder",
    direction: "asc",
  });
  const mutations = useMenuMutations(selectedRestaurantId);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<MenuItemStatus>("DRAFT");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("15");
  const [kitchenStation, setKitchenStation] = useState("WOOD_FIRE_OVEN");
  const [sizes, setSizes] = useState<MenuSizeInput[]>([
    emptySize(1),
    emptySize(2),
    emptySize(3),
  ]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!existing.data || hydrated) return;
    const item = existing.data;
    setName(item.name);
    setSlug(item.slug);
    setCategoryId(item.categoryId);
    setDescription(item.description ?? "");
    setStatus(item.status);
    setPrepTimeMinutes(String(item.prepTimeMinutes));
    setKitchenStation(item.kitchenStation ?? "WOOD_FIRE_OVEN");
    setSizes(
      item.sizes.map((size) => ({
        name: size.name,
        diameterInches: size.diameterInches,
        slices: size.slices,
        servingDescription: size.servingDescription,
        priceMinor: size.priceMinor,
        currency: size.currency,
        isAvailable: size.isAvailable,
        displayOrder: size.displayOrder,
      })),
    );
    setHydrated(true);
  }, [existing.data, hydrated]);

  if (id && existing.isLoading) return <PageLoading />;
  if (id && (existing.isError || !existing.data))
    return <ErrorState message="Unable to load this menu item for editing." />;

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const body: MenuItemInput = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      categoryId,
      description: description.trim() || null,
      status,
      currency: "PKR",
      imageUrl: null,
      prepTimeMinutes: Number(prepTimeMinutes),
      kitchenStation: kitchenStation.trim() || null,
      sku: existing.data?.sku ?? null,
      ingredients: ["flour", "tomato", "mozzarella"],
      allergens: ["DAIRY", "GLUTEN"],
      sauceBase: "Signature Tomato Sauce",
      cheeseBlend: "Mozzarella",
      doughType: "Hand-tossed",
      specialInstructions: null,
      sizes,
    };
    const request = id
      ? mutations.update.mutateAsync({ id, body })
      : mutations.create.mutateAsync(body);
    void request.then(() => {
      window.location.href = "/menu";
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1180px] space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/menu"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Menu
            </Link>
            <h1 className="type-page-title mt-2">
              {id ? "Edit Pizza" : "Create Pizza"}
            </h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              Configure the pizza, pricing, and kitchen details for your menu.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/menu"
              className="rounded border px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              form="menu-form"
              disabled={
                mutations.create.isPending || mutations.update.isPending
              }
              className="rounded bg-primary px-5 py-2 text-sm font-semibold text-white"
            >
              {id ? "Save Changes" : "Create Pizza"}
            </button>
          </div>
        </div>
        <form
          id="menu-form"
          onSubmit={save}
          className="grid gap-6 lg:grid-cols-3"
        >
          <Card className="space-y-5 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-1 text-sm font-semibold md:col-span-2">
                Pizza name
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                />
              </label>
              <label className="space-y-1 text-sm font-semibold">
                Slug
                <Input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  className="font-mono"
                />
              </label>
              <label className="space-y-1 text-sm font-semibold">
                Category
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  required
                  className="h-10 w-full rounded border bg-surface-lowest px-3"
                >
                  {" "}
                  <option value="">Select category</option>
                  {(categories.data?.items ?? []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm font-semibold md:col-span-2">
                Description
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  className="w-full rounded border bg-surface-lowest p-2 text-sm"
                />
              </label>
              <label className="space-y-1 text-sm font-semibold">
                Status
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as MenuItemStatus)
                  }
                  className="h-10 w-full rounded border bg-surface-lowest px-3"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </label>
            </div>
            <div className="border-t pt-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Pricing &amp; Sizes</h2>
                <button
                  type="button"
                  className="rounded border px-3 py-2 text-sm font-semibold"
                  onClick={() =>
                    setSizes((items) => [...items, emptySize(items.length + 1)])
                  }
                >
                  Add Size
                </button>
              </div>
              <div className="space-y-3">
                {sizes.map((size, index) => (
                  <div
                    key={`${size.name}-${index}`}
                    className="grid gap-3 rounded bg-surface-low p-3 sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <label className="space-y-1 text-sm font-semibold">
                      Size
                      <Input
                        value={size.name}
                        onChange={(event) =>
                          setSizes((items) =>
                            items.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, name: event.target.value }
                                : item,
                            ),
                          )
                        }
                        required
                      />
                    </label>
                    <label className="space-y-1 text-sm font-semibold">
                      Price (PKR)
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={size.priceMinor / 100}
                        onChange={(event) =>
                          setSizes((items) =>
                            items.map((item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    priceMinor: Math.round(
                                      Number(event.target.value) * 100,
                                    ),
                                  }
                                : item,
                            ),
                          )
                        }
                        required
                      />
                    </label>
                    <button
                      type="button"
                      className="self-end rounded p-2 text-sm text-destructive disabled:opacity-40"
                      disabled={sizes.length === 1}
                      onClick={() =>
                        setSizes((items) =>
                          items.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card className="space-y-5 p-6">
            <h2 className="text-lg font-semibold">Kitchen Preparation</h2>
            <label className="space-y-1 text-sm font-semibold">
              Preparation time (minutes)
              <Input
                type="number"
                min="0"
                max="1440"
                value={prepTimeMinutes}
                onChange={(event) => setPrepTimeMinutes(event.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold">
              Kitchen station
              <select
                value={kitchenStation}
                onChange={(event) => setKitchenStation(event.target.value)}
                className="h-10 w-full rounded border bg-surface-lowest px-3"
              >
                <option value="WOOD_FIRE_OVEN">Wood Fire Oven</option>
                <option value="PREP_LINE">Prep &amp; Assembly</option>
                <option value="EXPRESS_OVEN">Express Oven</option>
              </select>
            </label>
            <div className="rounded bg-surface-low p-3 text-xs text-muted-foreground">
              Prices are sent to the backend as integer minor units to preserve
              currency precision.
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
