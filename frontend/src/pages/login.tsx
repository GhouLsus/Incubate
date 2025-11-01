import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "../hooks/useAuth";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
    onSuccess: () => {
      const redirect = (router.query.from as string) ?? "/dashboard";
      router.replace(redirect).catch(console.error);
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard").catch(console.error);
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Head>
        <title>Sweet Shop - Login</title>
      </Head>
      <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Log in to manage your sweet adventures.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              {...register("email")}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              {...register("password")}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:bg-purple-300"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {loginMutation.isError && (
          <p className="mt-3 text-sm text-red-600">Unable to login. Please verify your credentials.</p>
        )}

        <p className="mt-6 text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-purple-600 hover:text-purple-700">
            Create one
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
