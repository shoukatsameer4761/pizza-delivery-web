import Link from "next/link";
import { RestaurantForm } from "@/components/restaurants/restaurant-form";

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-[1000px] space-y-6">
        <Link
          href={`/restaurants/${id}`}
          className="text-sm font-semibold text-primary"
        >
          ← Restaurant details
        </Link>
        <div>
          <h1 className="type-page-title mt-3">Edit restaurant</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update the restaurant profile and operating configuration.
          </p>
        </div>
        <RestaurantForm restaurantId={id} />
      </div>
    </div>
  );
}
