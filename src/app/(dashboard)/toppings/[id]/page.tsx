import { ToppingApiDetails } from "@/components/toppings/topping-api-screens";

export default async function ToppingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ToppingApiDetails id={id} />;
}
