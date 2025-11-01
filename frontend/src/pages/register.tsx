import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" as UserRole });

  const registerMutation = useMutation({
    mutationFn: () => register(form),
    onSuccess: () => {
      router.replace("/").catch(console.error);
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/").catch(console.error);
    }
  }, [isAuthenticated, router]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    registerMutation.mutate();
  };

  return (
    <>
      <Head>
        <title>Sweet Shop - Register</title>
      </Head>
      <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create an account</h1>
        <p className="mt-2 text-sm text-slate-500">Join the Sweet Shop to explore and manage delightful treats.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            >
              <option value="user">Customer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:bg-purple-300"
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        {registerMutation.isError && (
          <p className="mt-3 text-sm text-red-600">Unable to register. Please try a different email.</p>
        )}

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-purple-600 hover:text-purple-700">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
