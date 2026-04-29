"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PenSquare } from "lucide-react";

import { getPost } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostDetailsPage({ postId }: { postId: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await getPost(postId);
        setPost(response);
      } catch {
        toast.error("Unable to load the selected post.");
      } finally {
        setLoading(false);
      }
    };

    void loadPost();
  }, [postId]);

  if (loading) {
    return (
      <SiteShell>
        <div className="space-y-4">
          <Skeleton className="h-16 rounded-[2rem]" />
          <Skeleton className="h-[540px] rounded-[2rem]" />
        </div>
      </SiteShell>
    );
  }

  if (!post) {
    return (
      <SiteShell title="Post not found" description="The requested article could not be loaded.">
        <Card className="rounded-[2rem]">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">The article may have been removed or renamed.</p>
          </CardContent>
        </Card>
      </SiteShell>
    );
  }

  return (
    <SiteShell
      title={post.title}
      description={post.shortDescription}
      action={
        isLoggedIn() ? (
          <Button asChild>
            <Link href={`/edit/${post._id}`}>
              <PenSquare />
              Edit Post
            </Link>
          </Button>
        ) : null
      }
    >
      <article className="mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-card/90 shadow-[0_30px_80px_-40px_rgba(95,44,31,0.35)]">
        <Image
          src={post.imageUrl || "https://placehold.co/1200x700?text=Blog+Cover"}
          alt={post.title}
          width={1200}
          height={700}
          className="aspect-[16/8] w-full object-cover"
        />
        <div className="space-y-8 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={post.status === "on" ? "success" : "muted"}>
              {post.status === "on" ? "Published" : "Draft"}
            </Badge>
            <Badge>{post.category}</Badge>
            <span className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</span>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] border border-border bg-background/70 p-5 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Author</p>
              <p className="mt-2 font-medium text-foreground">{post.author}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Summary</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {post.shortDescription}
              </p>
            </div>
          </div>

          <div className="space-y-5 text-base leading-8 text-foreground">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={`${post._id}-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="default">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
