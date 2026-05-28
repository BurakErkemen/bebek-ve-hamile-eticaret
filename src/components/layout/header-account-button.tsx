"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function HeaderAccountButton() {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: { customer?: { firstName?: string } | null }) => {
        if (active) {
          setFirstName(data.customer?.firstName ?? null);
        }
      })
      .catch(() => {
        if (active) {
          setFirstName(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Link
      href={firstName ? "/hesap" : "/giris"}
      className="hidden rounded-full border border-brand-border bg-brand-white px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-secondary sm:inline-flex"
    >
      {firstName ? "Hesabım" : "Giriş Yap"}
    </Link>
  );
}
