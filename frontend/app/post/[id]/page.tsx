import { PostDetailsPage } from "@/components/posts/post-details-page";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostDetailsPage postId={id} />;
}
