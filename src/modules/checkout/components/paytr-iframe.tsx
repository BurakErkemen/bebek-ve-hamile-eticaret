"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    iFrameResize?: (
      options: Record<string, unknown>,
      selector: string,
    ) => void;
  }
}

type PaytrIframeProps = {
  iframeToken: string;
};

export function PaytrIframe({ iframeToken }: PaytrIframeProps) {
  useEffect(() => {
    if (window.iFrameResize) {
      window.iFrameResize({}, "#paytriframe");
    }
  }, [iframeToken]);

  return (
    <section className="rounded-[var(--radius-brand-xl)] border border-brand-border bg-brand-white p-5">
      <Script
        src="https://www.paytr.com/js/iframeResizer.min.js?v2"
        strategy="afterInteractive"
        onLoad={() => {
          window.iFrameResize?.({}, "#paytriframe");
        }}
      />

      <iframe
        src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
        id="paytriframe"
        title="PayTR Ödeme Ekranı"
        frameBorder="0"
        scrolling="no"
        className="min-h-[720px] w-full"
      />
    </section>
  );
}
