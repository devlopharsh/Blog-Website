import { AuthCard } from "@/components/common/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Register once, then manage publishing operations from any authenticated device."
    >
      <SignupForm />
    </AuthCard>
  );
}
