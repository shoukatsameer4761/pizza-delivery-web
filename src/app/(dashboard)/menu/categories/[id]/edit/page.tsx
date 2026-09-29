import { CategoryApiForm } from "@/components/categories/category-api-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryApiForm id={id} />;
}
