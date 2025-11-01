import type { ReactNode } from "react";
import Head from "next/head";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";

interface LayoutProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

const Layout = ({ title, className, children }: LayoutProps) => {
  const pageTitle = title ? `${title} - Sweet Shop` : "Sweet Shop";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen">
        <Navbar />
        <Toaster position="top-right" />
        <main className={clsx("mx-auto w-full max-w-6xl px-4 py-10", className)}>{children}</main>
      </div>
    </>
  );
};

export default Layout;
