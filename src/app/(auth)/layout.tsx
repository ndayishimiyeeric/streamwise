import React from "react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex pt-20 items-center justify-center h-full">
      {children}
    </div>
  );
}
