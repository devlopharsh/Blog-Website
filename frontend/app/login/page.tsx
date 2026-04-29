import { AuthCard } from "@/components/common/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to create, edit, and manage blog posts across the editorial dashboard."
    >
      <LoginForm redirect={redirect} />
    </AuthCard>
  );
}
