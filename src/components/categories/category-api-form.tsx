"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorState, PageLoading } from "@/components/shared/states";
import { useCategory, useCategoryMutations } from "@/hooks/use-catalog";
import { useRestaurant } from "@/providers/restaurant-provider";
import type { CategoryInput, CategoryStatus } from "@/types/catalog";

export function CategoryApiForm({ id }: { id?: string }) {
  const { selectedRestaurantId } = useRestaurant();
  const existing = useCategory(selectedRestaurantId, id ?? "");
  const mutations = useCategoryMutations(selectedRestaurantId);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [status, setStatus] = useState<CategoryStatus>("ACTIVE");

  useEffect(() => {
    if (!existing.data) return;
    setName(existing.data.name);
    setSlug(existing.data.slug);
    setDescription(existing.data.description ?? "");
    setDisplayOrder(String(existing.data.displayOrder));
    setStatus(existing.data.status);
  }, [existing.data]);

  if (id && existing.isLoading) return <PageLoading />;
  if (id && (existing.isError || !existing.data))
    return <ErrorState message="Unable to load this category for editing." />;

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const body: CategoryInput = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim() || null,
      displayOrder: Number(displayOrder),
      status,
    };
    const request = id
      ? mutations.update.mutateAsync({ id, body })
      : mutations.create.mutateAsync(body);
    void request.then(() => {
      window.location.href = "/categories";
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/categories"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Categories
            </Link>
            <h1 className="type-page-title mt-2">
              {id ? "Edit Category" : "Create Category"}
            </h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              Organize the restaurant menu with customer-facing categories.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/categories"
              className="rounded border px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              form="category-form"
              disabled={
                mutations.create.isPending || mutations.update.isPending
              }
              className="rounded bg-primary px-5 py-2 text-sm font-semibold text-white"
            >
              {id ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </div>
        <form
          id="category-form"
          onSubmit={save}
          className="grid gap-6 lg:grid-cols-3"
        >
          <Card className="space-y-5 p-6 lg:col-span-2">
            <label className="space-y-1 text-sm font-semibold">
              Category name
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
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded border bg-surface-lowest p-2 text-sm"
              />
            </label>
          </Card>
          <Card className="space-y-5 p-6">
            <label className="space-y-1 text-sm font-semibold">
              Display order
              <Input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(event) => setDisplayOrder(event.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold">
              Status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as CategoryStatus)
                }
                className="h-10 w-full rounded border bg-surface-lowest px-3"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </label>
          </Card>
        </form>
      </div>
    </div>
  );
}
