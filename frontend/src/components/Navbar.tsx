import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-purple-600">
          Sweet Shop
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            Browse
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin/sweets" className="text-slate-600 hover:text-slate-900">
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-700">
                {user?.name} ({user?.role})
              </span>
              <button
                type="button"
                onClick={() => logout("/login")}
                className="rounded-md border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="rounded-md bg-purple-600 px-3 py-1 text-white hover:bg-purple-700"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
