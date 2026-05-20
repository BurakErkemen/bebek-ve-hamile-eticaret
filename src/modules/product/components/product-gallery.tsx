"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ProductGalleryImage = {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
};

type ProductGalleryProps = {
  images: ProductGalleryImage[];
  productName: string;
};

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const orderedImages = useMemo(() => {
    return [...images].sort((firstImage, secondImage) => {
      if (firstImage.isPrimary && !secondImage.isPrimary) {
        return -1;
      }

      if (!firstImage.isPrimary && secondImage.isPrimary) {
        return 1;
      }

      return 0;
    });
  }, [images]);

  const fallbackImage: ProductGalleryImage = {
    id: "fallback-product-image",
    url: "/placeholders/products/bebek-tulum.svg",
    alt: productName,
    isPrimary: true,
  };

  const galleryImages =
    orderedImages.length > 0 ? orderedImages : [fallbackImage];

  const [activeImageId, setActiveImageId] = useState(
    galleryImages[0].id,
  );

  const activeImage =
    galleryImages.find((image) => image.id === activeImageId) ??
    galleryImages[0];

  return (
    <section>
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white">
        <Image
          src={activeImage.url}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {galleryImages.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {galleryImages.map((image) => {
            const isActive = image.id === activeImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageId(image.id)}
                className={`relative aspect-square overflow-hidden rounded-2xl border bg-brand-white transition ${
                  isActive
                    ? "border-brand-primary ring-2 ring-brand-primary/25"
                    : "border-brand-border hover:border-brand-primary/60"
                }`}
                aria-label={`${productName} görselini seç`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}