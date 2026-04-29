"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { createPost, updatePost } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { postFormSchema, type PostFormValues } from "@/lib/schemas";
import type { Post } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/posts/tag-input";

interface PostFormProps {
  mode: "create" | "edit";
  post?: Post;
}

export function PostForm({ mode, post }: PostFormProps) {
  const router = useRouter();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title ?? "",
      shortDescription: post?.shortDescription ?? "",
      content: post?.content ?? "",
      author: post?.author ?? "",
      category: post?.category ?? "",
      tags: post?.tags.join(", ") ?? "",
      imageUrl: post?.imageUrl ?? "",
      status: post?.status ?? "on",
    },
  });

  const imageUrl = useWatch({ control: form.control, name: "imageUrl" });
  const shortDescription = useWatch({
    control: form.control,
    name: "shortDescription",
  });
  const tagsValue = useWatch({ control: form.control, name: "tags" });
  const status = useWatch({ control: form.control, name: "status" });

  const onSubmit = form.handleSubmit(async (values) => {
    const user = getStoredUser();
    if (!user?.email) {
      toast.error("Session is missing user email. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      const payload = { ...values, email: user.email };

      if (mode === "create") {
        await createPost(payload);
        toast.success("Post created successfully.");
      } else if (post?._id) {
        await updatePost(post._id, payload);
        toast.success("Post updated successfully.");
      }

      router.push("/blogs");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to save the post right now.";
      toast.error(message);
    }
  });

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create Post" : "Edit Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={onSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
              <p className="text-sm text-destructive">{form.formState.errors.title?.message}</p>
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                rows={3}
                {...form.register("shortDescription")}
              />
              <div className="flex items-center justify-between text-sm">
                <p className="text-destructive">
                  {form.formState.errors.shortDescription?.message}
                </p>
                <span className="text-muted-foreground">
                  {shortDescription.length}/200
                </span>
              </div>
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" rows={10} {...form.register("content")} />
              <p className="text-sm text-destructive">{form.formState.errors.content?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...form.register("author")} />
              <p className="text-sm text-destructive">{form.formState.errors.author?.message}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...form.register("category")} />
              <p className="text-sm text-destructive">
                {form.formState.errors.category?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput
                value={tagsValue}
                onChange={(value) => form.setValue("tags", value, { shouldValidate: true })}
                placeholder="react, design systems, nextjs"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" {...form.register("imageUrl")} />
                <p className="text-sm text-destructive">
                  {form.formState.errors.imageUrl?.message}
                </p>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-muted">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Post preview"
                    width={960}
                    height={600}
                    className="aspect-[16/10] h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center text-sm text-muted-foreground">
                    Image preview
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-foreground">Post status</p>
              <p className="text-sm text-muted-foreground">
                Toggle published visibility for this article.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {status === "on" ? "Published" : "Draft"}
              </span>
              <Switch
                checked={status === "on"}
                onCheckedChange={(checked) =>
                  form.setValue("status", checked ? "on" : "off", { shouldValidate: true })
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/blogs")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                  ? "Create Post"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
