"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove).join(", "));
  };

  return (
    <div className="space-y-3">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge key={tag} variant="default" className="gap-1 pr-1">
              #{tag}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-5 rounded-full p-0 hover:bg-white/25"
                onClick={() => removeTag(tag)}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Add comma-separated tags to organize discovery.
          </p>
        )}
      </div>
    </div>
  );
}
