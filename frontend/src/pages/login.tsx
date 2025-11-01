import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "../hooks/useAuth";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const loginMutation = useMutation({
    mutationFn: () => login(form),
    onSuccess: () => {
      const redirect = (router.query.from as string) ?? "/";
      router.replace(redirect).catch(console.error);
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/").catch(console.error);
    }
  }, [isAuthenticated, router]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate();
  };

  return (
    <>
      <Head>
        <title>Sweet Shop - Login</title>
      </Head>
      <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Log in to manage your sweet adventures.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
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
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
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
