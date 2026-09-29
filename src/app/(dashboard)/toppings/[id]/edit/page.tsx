import { ToppingApiForm } from "@/components/toppings/topping-api-screens";

export default async function EditToppingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ToppingApiForm id={id} />;
}
