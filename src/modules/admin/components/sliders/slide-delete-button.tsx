"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SlideDeleteButton({
  sliderId,
  slideId,
  title,
}: {
  sliderId: string;
  slideId: string;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${title}" slaytını silmek istediğinize emin misiniz?`)) return;
    setLoading(true);
    await fetch(`/api/admin/sliders/${sliderId}/slides/${slideId}`, { method: "DELETE" });
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
