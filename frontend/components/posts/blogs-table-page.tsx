"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Check,
  Download,
  Eye,
  PenSquare,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { deletePost, exportCSV, getPosts } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Post, PostsQuery } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LOGIN_REQUIRED_MESSAGE = "Please login to access";

function matchesAny(values: string[], source: string[]) {
  if (values.length === 0) return true;
  return values.some((value) =>
    source.some((entry) => entry.toLowerCase() === value.toLowerCase()),
  );
}

function MultiFilter({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between rounded-2xl"
        >
          <span className="truncate">
            {selected.length > 0
              ? `${label} (${selected.length})`
              : `Filter by ${label.toLowerCase()}`}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[1.75rem]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            Select one or more {label.toLowerCase()} values to narrow the
            results.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {options.length > 0 ? (
            options.map((option) => {
              const active = selected.includes(option);
              return (
                <Button
                  key={option}
                  type="button"
                  variant={active ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => onToggle(option)}
                >
                  {active ? <Check /> : null}
                  {option}
                </Button>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No options available yet.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={selected.length === 0}
          >
            <X />
            Clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BlogsTablePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [busyDelete, setBusyDelete] = useState(false);

  const debouncedSearch = useDebouncedValue(search);

  const loadPosts = useCallback(async () => {
    setLoading(true);

    const query: PostsQuery = {
      page,
      limit: 10,
      search: debouncedSearch || undefined,
    };

    try {
      const response = await getPosts(query);
      const filteredPosts = response.posts.filter((post) => {
        const authorMatch = matchesAny(authors, [post.author]);
        const categoryMatch = matchesAny(categories, [post.category]);
        const tagMatch = matchesAny(tags, post.tags);

        return authorMatch && categoryMatch && tagMatch;
      });

      setAllPosts(response.posts);
      setPosts(filteredPosts);
      setTotal(response.total);
      setTotalPages(response.totalPages || 1);
    } catch {
      toast.error("Unable to load blog posts.");
    } finally {
      setLoading(false);
    }
  }, [authors, categories, debouncedSearch, page, tags]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const uniqueAuthors = Array.from(
    new Set(allPosts.map((post) => post.author)),
  );
  const uniqueCategories = Array.from(
    new Set(allPosts.map((post) => post.category)),
  );
  const uniqueTags = Array.from(new Set(allPosts.flatMap((post) => post.tags)));

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="min-w-[240px]">
          <p className="font-semibold text-foreground">
            <Link href={`/post/${row.id}`} className="hover:underline">
              {row.original.title}
            </Link>
          </p>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {row.original.shortDescription}
          </p>
        </div>
      ),
    },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "category", header: "Category" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "on" ? "success" : "muted"}>
          {row.original.status === "on" ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex min-w-[200px] flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/post/${row.original._id}`}>
              <Eye />
              View
            </Link>
          </Button>
          {isLoggedIn() ? (
            <>
              <Button asChild size="sm" variant="secondary">
                <Link href={`/edit/${row.original._id}`}>
                  <PenSquare />
                  Edit
                </Link>
              </Button>
              <Dialog
                open={deleteTarget?._id === row.original._id}
                onOpenChange={(open) =>
                  setDeleteTarget(open ? row.original : null)
                }
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete this post?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. The selected post will be
                      removed from the listing immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteTarget(null)}
                      disabled={busyDelete}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={busyDelete}
                      onClick={async () => {
                        if (!deleteTarget) return;
                        try {
                          setBusyDelete(true);
                          await deletePost(deleteTarget._id);
                          toast.success("Post deleted successfully.");
                          setDeleteTarget(null);
                          await loadPosts();
                        } catch {
                          toast.error("Unable to delete this post.");
                        } finally {
                          setBusyDelete(false);
                        }
                      }}
                    >
                      {busyDelete ? "Deleting..." : "Delete Post"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <div title={LOGIN_REQUIRED_MESSAGE}>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    toast.message("Please login to access");
                  }}
                >
                  <PenSquare />
                  Edit
                </Button>
              </div>
              <div title={LOGIN_REQUIRED_MESSAGE}>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    toast.message("Please login to access");
                  }}
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <SiteShell
      title="Blog management console"
      description="Search, filter, export, and manage your editorial catalog with a responsive table tuned for smaller screens and full desktop workflows."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                const blob = await exportCSV({
                  search: debouncedSearch || undefined,
                  author: authors.length === 1 ? authors[0] : undefined,
                  category: categories.length === 1 ? categories[0] : undefined,
                  tags: tags.length === 1 ? tags[0] : undefined,
                });

                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = "posts.csv";
                anchor.click();
                URL.revokeObjectURL(url);
                toast.success("CSV exported successfully.");
              } catch {
                toast.error("Unable to export CSV.");
              }
            }}
          >
            <Download />
            Export CSV
          </Button>
          {isLoggedIn() ? (
            <Button asChild>
              <Link href="/add">
                <Plus />
                Add Post
              </Link>
            </Button>
          ) : (
            <div title={LOGIN_REQUIRED_MESSAGE}>
              <Button
                onClick={() => {
                  toast.message("Please login to access");
                }}
              >
                <Plus />
                Add Post
              </Button>
            </div>
          )}
        </div>
      }
    >
      <section className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card/90 p-4 shadow-[0_25px_60px_-30px_rgba(95,44,31,0.35)] sm:p-6 xl:flex-row xl:items-center">
        <div className="relative xl:min-w-0 xl:flex-[1.8]">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            className="pl-11"
            placeholder="Search by title"
          />
        </div>
        <div className="flex flex-col gap-4 md:flex-row xl:flex-[1.7]">
          <div className="md:flex-1">
            <MultiFilter
              label="Authors"
              options={uniqueAuthors}
              selected={authors}
              onToggle={(value) => {
                setPage(1);
                setAuthors((current) =>
                  current.includes(value)
                    ? current.filter((item) => item !== value)
                    : [...current, value],
                );
              }}
              onClear={() => {
                setPage(1);
                setAuthors([]);
              }}
            />
          </div>
          <div className="md:flex-1">
            <MultiFilter
              label="Categories"
              options={uniqueCategories}
              selected={categories}
              onToggle={(value) => {
                setPage(1);
                setCategories((current) =>
                  current.includes(value)
                    ? current.filter((item) => item !== value)
                    : [...current, value],
                );
              }}
              onClear={() => {
                setPage(1);
                setCategories([]);
              }}
            />
          </div>
          <div className="md:flex-1">
            <MultiFilter
              label="Tags"
              options={uniqueTags}
              selected={tags}
              onToggle={(value) => {
                setPage(1);
                setTags((current) =>
                  current.includes(value)
                    ? current.filter((item) => item !== value)
                    : [...current, value],
                );
              }}
              onClear={() => {
                setPage(1);
                setTags([]);
              }}
            />
          </div>
        </div>
      </section>

      {authors.length > 0 || categories.length > 0 || tags.length > 0 ? (
        <section className="flex flex-wrap items-center gap-2 rounded-[1.5rem] border border-border bg-card/80 p-4">
          {authors.map((item) => (
            <Badge key={`author-${item}`} className="gap-2">
              Author: {item}
              <button
                type="button"
                onClick={() =>
                  setAuthors((current) =>
                    current.filter((entry) => entry !== item),
                  )
                }
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {categories.map((item) => (
            <Badge key={`category-${item}`} className="gap-2">
              Category: {item}
              <button
                type="button"
                onClick={() =>
                  setCategories((current) =>
                    current.filter((entry) => entry !== item),
                  )
                }
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {tags.map((item) => (
            <Badge key={`tag-${item}`} className="gap-2">
              Tag: {item}
              <button
                type="button"
                onClick={() =>
                  setTags((current) =>
                    current.filter((entry) => entry !== item),
                  )
                }
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setAuthors([]);
              setCategories([]);
              setTags([]);
              setPage(1);
            }}
          >
            Clear all
          </Button>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-border bg-card/90 p-4 shadow-[0_25px_60px_-30px_rgba(95,44,31,0.35)] sm:p-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-28 text-center text-muted-foreground"
                    >
                      No posts match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} • {total} total results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </SiteShell>
  );
}
