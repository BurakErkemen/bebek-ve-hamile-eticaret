"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function HeaderAccountButton() {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then(r => r.json())
      .then((data: { customer?: { firstName?: string } | null }) => {
        if (active) setFirstName(data.customer?.firstName ?? null);
      })
      .catch(() => { if (active) setFirstName(null); });
    return () => { active = false; };
  }, []);

  return (
    <Link
      href={firstName ? "/hesap" : "/giris"}
      className="hidden rounded-full border border-border bg-surface-card px-4 py-2 text-sm font-medium text-ink transition hover:border-amber hover:text-amber sm:inline-flex"
    >
      {firstName ? `${firstName}` : "Giriş Yap"}
    </Link>
  );
}
