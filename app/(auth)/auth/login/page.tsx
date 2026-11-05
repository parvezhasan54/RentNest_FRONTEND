import Link from "next/link";

import { Logo } from "@/components/shared/Logo";
import { Card } from "@/components/ui/card";
import LoginForm from "../_component/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Logo className="mb-6" />
      <Card className="w-full max-w-md p-6 sm:p-8">
        <h1 className="text-center text-2xl font-semibold">Welcome back</h1>
        <p className="mb-6 mt-1 text-center">Sign in to pick up where you left off.</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm">
          New to RentNest?{" "}
          <Link className="font-medium text-primary underline" href="/auth/register">Create an account</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;