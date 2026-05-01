import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Trang Không Tìm Thấy",
  description:
    "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Khám phá các bài viết về chăm sóc mẹ và bé tại Ngoan Xinh Yêu.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50/60 to-white px-4 py-20 font-[family-name:var(--font-sans)]">
      {/* Decorative blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-100/60 blur-3xl" />
      </div>

      {/* Big 404 number */}
      <p
        className="text-[120px] sm:text-[180px] font-extrabold leading-none tracking-tighter"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        aria-label="404"
      >
        404
      </p>

      {/* Icon */}
      <div className="mt-2 mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 text-4xl shadow-inner">
        🔍
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-3">
        Ôi! Trang này không tồn tại
      </h1>
      <p className="text-gray-500 text-center max-w-md mb-10 leading-relaxed">
        Có thể trang đã được di chuyển hoặc địa chỉ URL bạn nhập không đúng.
        Hãy thử tìm kiếm hoặc quay về trang chủ nhé!
      </p>

      {/* Primary CTA */}
      <Link
        href="/"
        id="not-found-home-btn"
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all duration-150 text-white font-semibold px-7 py-3 rounded-full shadow-md hover:shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 11h1v6a1 1 0 001 1h4a1 1 0 001-1v-4h2v4a1 1 0 001 1h4a1 1 0 001-1v-6h1a1 1 0 00.707-1.707l-7-7z" />
        </svg>
        Về trang chủ
      </Link>
    </div>
  );
}
