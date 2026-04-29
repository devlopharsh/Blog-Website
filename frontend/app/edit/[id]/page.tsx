import { PostFormPage } from "@/components/posts/post-form-page";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostFormPage mode="edit" postId={id} />;
}
