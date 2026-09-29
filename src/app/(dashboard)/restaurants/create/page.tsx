import Link from "next/link";
import { Info, MapPin } from "lucide-react";
import { RestaurantForm } from "@/components/restaurants/restaurant-form";
export default function CreateRestaurantPage() {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex gap-2 text-body-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Link href="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
              <span>/</span>
              <Link href="/restaurants" className="hover:text-primary">
                Restaurants
              </Link>
              <span>/</span>
              <span className="text-primary">Add New</span>
            </div>
            <h1 className="type-page-title">Create Restaurant</h1>
            <p className="mt-1 text-body-reg text-muted-foreground">
              Register a new restaurant location on the platform with
              operational parameters.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/restaurants"
              className="inline-flex h-10 items-center justify-center rounded-[var(--radius)] border bg-surface-lowest px-4 text-sm font-semibold hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              form="create-restaurant-form"
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-container"
            >
              Create Restaurant
            </button>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RestaurantForm />
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <section className="relative overflow-hidden rounded-[var(--radius-lg)] border bg-surface-lowest p-5">
              <div className="mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="type-card-title">Registration Meta</h2>
              </div>
              <p className="text-body-sm text-muted-foreground">
                Creating a new restaurant establishes a master tenant record.
                Default menu templates and tax rules will be auto-assigned.
              </p>
              <dl className="mt-4 space-y-3 border-t pt-4 text-body-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Assigned Cluster</dt>
                  <dd className="text-right font-semibold">
                    Central Lahore Hub
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Platform Commission</dt>
                  <dd className="font-semibold">12.5%</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Default Status</dt>
                  <dd className="font-semibold text-success">
                    Active on Deploy
                  </dd>
                </div>
              </dl>
            </section>
            <section className="rounded-[var(--radius-lg)] border bg-surface-lowest p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="type-card-title">Geo-Fence Preview</h2>
                <span className="text-body-sm font-semibold text-primary">
                  Pin Location
                </span>
              </div>
              <div className="flex h-40 items-center justify-center rounded-[var(--radius)] border bg-surface-low text-muted-foreground">
                <MapPin className="h-8 w-8 text-primary/50" />
              </div>
              <p className="mt-3 text-body-sm text-muted-foreground">
                Drag marker on the operational map once the address is saved.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
