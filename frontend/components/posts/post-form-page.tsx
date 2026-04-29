"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getPost } from "@/lib/api";
import type { Post } from "@/lib/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SiteShell } from "@/components/layout/site-shell";
import { PostForm } from "@/components/posts/post-form";
import { Skeleton } from "@/components/ui/skeleton";

export function PostFormPage({
  mode,
  postId,
}: {
  mode: "create" | "edit";
  postId?: string;
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !postId) return;

    const loadPost = async () => {
      try {
        const response = await getPost(postId);
        setPost(response);
      } catch {
        toast.error("Unable to load this post.");
      } finally {
        setLoading(false);
      }
    };

    void loadPost();
  }, [mode, postId]);

  return (
    <ProtectedRoute>
      <SiteShell
        title={mode === "create" ? "Compose a new story" : "Refine your article"}
        description="Use the shared editor to publish, revise, and manage editorial metadata across mobile and desktop workflows."
      >
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 rounded-[2rem]" />
            <Skeleton className="h-[480px] rounded-[2rem]" />
          </div>
        ) : (
          <PostForm mode={mode} post={post ?? undefined} />
        )}
      </SiteShell>
    </ProtectedRoute>
  );
}
