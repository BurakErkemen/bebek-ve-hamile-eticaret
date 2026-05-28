"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type SearchBarProps = {
  initialQuery?: string;
  className?: string;
};

export function SearchBar({ initialQuery = "", className }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    if (!query) {
      return;
    }
    router.push(`/arama?q=${encodeURIComponent(query)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`relative flex items-center ${className ?? ""}`}
    >
      <span className="pointer-events-none absolute left-3 text-brand-muted">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ürün ara…"
        aria-label="Ürün ara"
        className="w-full rounded-full border border-brand-border bg-brand-white py-2 pl-9 pr-4 text-sm text-brand-text outline-none transition focus:border-brand-primary"
      />
    </form>
  );
}
