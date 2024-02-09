import React from "react";
import AppShell from "@/components/application-shell";

const SharedLayout = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
  return (
    <>
      <div className={className}>
        <AppShell />
        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
};
export default SharedLayout;
