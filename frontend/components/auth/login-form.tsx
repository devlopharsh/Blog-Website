"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginSchema, type LoginFormValues } from "@/lib/schemas";
import { login } from "@/lib/api";
import { setStoredUser, setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ redirect = "/blogs" }: { redirect?: string }) {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const response = await login(values);
      setToken(response.token);
      setStoredUser({ email: values.email });
      toast.success("Logged in successfully.");
      router.push(redirect);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to log in. Please try again.";
      toast.error(message);
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        <p className="text-sm text-destructive">{form.formState.errors.email?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} />
        <p className="text-sm text-destructive">{form.formState.errors.password?.message}</p>
      </div>
      <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Signing in..." : "Login"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Need an account?{" "}
        <Link className="font-semibold text-primary hover:text-primary/80" href="/signup">
          Create one
        </Link>
      </p>
    </form>
  );
}
