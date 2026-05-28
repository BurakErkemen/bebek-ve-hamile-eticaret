"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SliderDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${name}" sliderını silmek istediğinize emin misiniz?`)) return;
    setLoading(true);
    await fetch(`/api/admin/sliders/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
    >
      {loading ? "Siliniyor..." : "Sil"}
    </button>
  );
}
