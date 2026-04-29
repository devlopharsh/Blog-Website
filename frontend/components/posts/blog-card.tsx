import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function BlogCard({ post }: { post: Post }) {
  return (
    <Card className="group overflow-hidden rounded-[1.75rem]">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post.imageUrl || "https://placehold.co/900x600?text=Blog+Cover"}
          alt={post.title}
          width={900}
          height={600}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={post.status === "on" ? "success" : "muted"}>
            {post.status === "on" ? "Published" : "Draft"}
          </Badge>
          <Badge variant="default">{post.category}</Badge>
        </div>
        <CardTitle className="line-clamp-2 leading-tight">{post.title}</CardTitle>
        <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
          {post.shortDescription}
        </p>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>
          <p className="font-medium text-foreground">{post.author}</p>
          <p>{formatDate(post.createdAt)}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/post/${post._id}`}>
            Read More
            <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
