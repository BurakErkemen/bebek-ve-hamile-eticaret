"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BlogPostDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${title}" yazısını silmek istediğinize emin misiniz?`)) return;
    setLoading(true);
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium disabled:opacity-40">
      {loading ? "Siliniyor..." : "Sil"}
    </button>
  );
}
