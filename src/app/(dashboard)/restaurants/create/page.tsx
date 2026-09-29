import Link from "next/link";
import { RestaurantForm } from "@/components/restaurants/restaurant-form";

export default function CreateRestaurantPage() {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-[1000px] space-y-6">
        <div>
          <Link
            href="/restaurants"
            className="text-sm font-semibold text-primary"
          >
            ← Restaurants
          </Link>
          <h1 className="type-page-title mt-3">Create restaurant</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new tenant with validated contact, location, and operating
            settings.
          </p>
        </div>
        <RestaurantForm />
      </div>
    </div>
  );
}
