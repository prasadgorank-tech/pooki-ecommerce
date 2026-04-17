import { redirect } from "next/navigation";

export default async function CategoryCollection({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  // Redirect to all collections — the filter state is handled client-side
  redirect(`/collections/all?category=${category}`);
}
