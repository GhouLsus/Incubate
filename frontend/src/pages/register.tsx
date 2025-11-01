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

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const { register: registerUser, isAuthenticated } = useAuth();

  const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["user", "admin"] as const),
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "user" },
  });

  const registerMutation = useMutation({
    mutationFn: (values: RegisterFormValues) => registerUser(values),
    onSuccess: () => {
      router.replace("/dashboard").catch(console.error);
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
        <title>Sweet Shop - Register</title>
      </Head>
      <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create an account</h1>
        <p className="mt-2 text-sm text-slate-500">Join the Sweet Shop to explore and manage delightful treats.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => registerMutation.mutate(values))}>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              {...register("name")}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
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
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              {...register("role")}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            >
              <option value="user">Customer</option>
              <option value="admin">Administrator</option>
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
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
