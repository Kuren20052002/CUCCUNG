# 🍼 Cục Cưng - Cộng đồng Mẹ & Bé (Next.js 15)

**Cục Cưng** là một nền tảng web hiện đại dành cho cộng đồng Mẹ & Bé, được tối ưu hóa hiệu năng và SEO vượt trội. Dự án tập trung vào việc cung cấp kiến thức chăm sóc trẻ nhỏ và kết nối các bậc phụ huynh.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng trên những công nghệ mới nhất năm 2026:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
* **Ngôn ngữ:** TypeScript
* **Database:** [Neon](https://neon.tech/) (Serverless Postgres)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Authentication:** [Auth.js v5](https://authjs.dev/) (NextAuth Beta)
* **Styling:** Tailwind CSS + Lucide Icons
* **UI Components:** Shadcn/ui & Sonner (Toast notifications)
* **Deployment:** [Vercel](https://ngoanxinhyeu.app/)

---

## ✨ Tính năng nổi bật

- [x] **Tối ưu SEO:** Cấu hình Metadata động, chuẩn hóa thẻ `lang="vi"`, tích hợp JSON-LD.
- [x] **Xác thực người dùng:** Đăng ký/Đăng nhập bảo mật với Role-based access (Admin/User).
- [x] **Quản lý nội dung:** Hệ thống CRUD bài viết, danh mục mẹ và bé.
- [x] **Giao diện Responsive:** Tối ưu hiển thị trên mọi thiết bị di động (Mobile-first).
- [x] **Hiệu suất cao:** Sử dụng Suspense bọc các thành phần động để tăng tốc độ Render.

---

## 🛠 Hướng dẫn cài đặt (Local Development)

1. **Clone dự án:**
   ```bash
   git clone [https://github.com/Kuren20052002/ngoanxinhyeu.git](https://github.com/Kuren20052002/ngoanxinhyeu.git)
   cd ngoanxinhyeu-seo
   ```

2. **Cài đặt thư viện:**
   ```bash
   pnpm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo file `.env` tại thư mục gốc và dán các biến sau:
   ```
   DATABASE_URL="your_neon_postgres_url"
   AUTH_SECRET="your_random_secret"
   ```

4. **Đẩy cấu trúc Database:**
   ```bash
   npx prisma db push
   ```

5. **Chạy dự án:**
   ```bash
   pnpm dev
   ```
   Truy cập: [http://localhost:3000](http://localhost:3000)

---

## 📈 Chiến lược SEO đã triển khai

Dự án này được thiết kế đặc biệt để đạt điểm cao trong các bài kiểm tra SEO:

- **Cấu trúc URL:** Thân thiện, chứa từ khóa (Slug-based).
- **Semantic HTML:** Sử dụng đúng các thẻ header, main, footer, article.
- **Performance:** Đạt chỉ số Core Web Vitals xanh nhờ cơ chế Static Generation của Next.js.
- **Accessibility:** Hỗ trợ Screen Reader và độ tương phản màu sắc chuẩn.

---

## 📂 Cấu trúc thư mục (Directory Structure)

```
├── app/              # Next.js App Router (Pages, API, Layouts)
├── actions/          # Server Actions (Xử lý logic phía Server)
├── components/       # UI Components tái sử dụng
├── prisma/           # Schema database và file Seed dữ liệu
├── public/           # Tài nguyên tĩnh (Images, Fonts)
└── lib/              # Cấu hình chung (Prisma client, Utils)
```
