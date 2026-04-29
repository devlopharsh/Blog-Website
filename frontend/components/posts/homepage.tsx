"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { getPosts } from "@/lib/api";
import type { Post } from "@/lib/types";
import { SiteShell } from "@/components/layout/site-shell";
import { BlogCard } from "@/components/posts/blog-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Homepage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await getPosts({ page: 1, limit: 10 });
        setPosts(response.posts);
      } catch {
        toast.error("Unable to load latest posts.");
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  return (
    <SiteShell
      title="Publish stories with a sharper editorial workflow"
      description="Manage your latest posts, surface polished public content, and keep authoring flows lightweight across phone, tablet, and desktop."
      action={
        <Button asChild size="lg">
          <Link href="/blogs">
            Explore all blogs
            <ArrowRight />
          </Link>
        </Button>
      }
    >
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-[420px] rounded-[1.75rem]" />
            ))
          : posts.map((post) => <BlogCard key={post._id} post={post} />)}
      </section>

      {!loading && posts.length > 0 ? (
        <div className="flex justify-center">
          <Button asChild variant="secondary" size="lg">
            <Link href="/blogs">View All Blogs</Link>
          </Button>
        </div>
      ) : null}
    </SiteShell>
  );
}
