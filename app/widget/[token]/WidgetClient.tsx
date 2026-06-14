"use client";

import { useEffect } from "react";

interface Testimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  author_avatar_url: string | null;
  content: string;
  rating: number | null;
  created_at: string;
}

interface Props {
  testimonials: Testimonial[];
  layout: string;
  accent: string;
  showWatermark: boolean;
}

function StarRating({ rating, accent }: { rating: number; accent: string }) {
  return (
    <div className="flex gap-0.5 mb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? accent : "#d1d5db" }} className="text-sm">
          ★
        </span>
      ))}
    </div>
  );
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

function TestimonialCard({ t, accent }: { t: Testimonial; accent: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3 break-words">
      {t.rating !== null && <StarRating rating={t.rating} accent={accent} />}
      <p className="text-gray-700 text-sm leading-relaxed">{t.content}</p>
      <div className="flex items-center gap-2 mt-auto pt-2">
        <Avatar name={t.author_name} url={t.author_avatar_url} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{t.author_name}</p>
          {t.author_title && (
            <p className="text-xs text-gray-500 truncate">{t.author_title}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function GridLayout({ testimonials, accent }: { testimonials: Testimonial[]; accent: string }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {testimonials.map((t) => (
        <div key={t.id} className="break-inside-avoid">
          <TestimonialCard t={t} accent={accent} />
        </div>
      ))}
    </div>
  );
}

function CarouselLayout({ testimonials, accent }: { testimonials: Testimonial[]; accent: string }) {
  if (testimonials.length === 0) return null;
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
      {testimonials.map((t) => (
        <div key={t.id} className="flex-shrink-0 w-72 snap-center">
          <TestimonialCard t={t} accent={accent} />
        </div>
      ))}
    </div>
  );
}

function SingleLayout({ testimonials, accent }: { testimonials: Testimonial[]; accent: string }) {
  const t = testimonials[0];
  if (!t) return null;
  return (
    <div className="max-w-lg mx-auto">
      <TestimonialCard t={t} accent={accent} />
    </div>
  );
}

export default function WidgetClient({ testimonials, layout, accent, showWatermark }: Props) {
  useEffect(() => {
    function sendHeight() {
      const h = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "wallflow:height", height: h }, "*");
    }

    // Send after all images have loaded
    if (document.readyState === "complete") {
      sendHeight();
    } else {
      window.addEventListener("load", sendHeight, { once: true });
    }

    const ro = new ResizeObserver(sendHeight);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  if (testimonials.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400 text-sm">
        No testimonials yet.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen font-sans">
      {layout === "grid" && <GridLayout testimonials={testimonials} accent={accent} />}
      {layout === "carousel" && <CarouselLayout testimonials={testimonials} accent={accent} />}
      {layout === "single" && <SingleLayout testimonials={testimonials} accent={accent} />}
      {layout !== "grid" && layout !== "carousel" && layout !== "single" && (
        <GridLayout testimonials={testimonials} accent={accent} />
      )}

      {showWatermark && (
        <div className="text-center mt-6 mb-2">
          <a
            href="https://wallflow.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Powered by Wallflow
          </a>
        </div>
      )}
    </div>
  );
}
