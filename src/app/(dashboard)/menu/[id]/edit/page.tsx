import { MenuApiForm } from "@/components/menus/menu-api-form";

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MenuApiForm id={id} />;
}
