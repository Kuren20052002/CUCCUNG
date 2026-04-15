<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENT.md — ngoanxinhyeu SEO WEBSITE SYSTEM

## 1. Project Overview

### 1.1 Goal
Build a SEO-optimized content website in the **Mother & Baby** niche.

### 1.2 Objectives
* Achieve high rankings on SERP for niche keywords.
* Serve as a case study for SEO performance evaluation.
* Provide high-quality, structured, and trustworthy content following E-E-A-T guidelines.

### 1.3 Target Audience
* Parents (especially new parents)
* Pregnant women
* Users interested in childcare, nutrition, and education

---

## 2. Tech Stack & Architecture

### 2.1 Core Stack
* **Framework**: Next.js v14+ (App Router)
* **Rendering Strategy**:
  * SSG (Static Site Generation) for SEO pages
  * SSR (Server-Side Rendering) where dynamic data is needed

### 2.2 Database
* Prisma ORM
* PostgreSQL (preferred) or SQL Server

### 2.3 Content Format
* Markdown (MD/MDX)

### 2.4 Styling & Media
* Tailwind CSS v4 (@tailwindcss/postcss) & @tailwindcss/typography plugin
* Sharp for Image Optimization
* Mobile-first design
* Fully responsive

---

## 3. Public Pages (Client-side)

### 3.1 Homepage `/`
* Display featured articles grouped by **Silo Structure**:
  * Pregnancy
  * Newborn Care
  * Nutrition
  * Tips & Tricks

### 3.2 Category Page `/[category]`
* List of articles
* Category description (SEO optimized)

### 3.3 Article Page `/[category]/[slug]`
#### Features:
* Render Markdown → HTML
* Auto-generate **Table of Contents (TOC)** from H2 and H3

#### Components:
* Author box (E-E-A-T compliant with avatar and bio)
* Related articles
* Comments / Ratings
* Tags for internal linking

### 3.4 Product Review System
#### Features:
* Detailed review layout with clear pros & cons
* Comparison tables
* Affiliate buttons
* Inject Rating via JSON-LD Structured Data

#### Example categories:
* Diapers
* Milk formula
* Toys

### 3.5 Author Page `/author/[slug]`
* Author information (Bio, Avatar, Social Links to establish E-E-A-T)
* List of authored articles

### 3.6 Mini Tools
* `/tools/due-date`: Pregnancy due date calculator
* `/tools/growth-chart`: Baby height/weight growth chart

---

## 4. CMS System (Admin Panel)

### 4.1 Authentication
* Login page: `/login`

### 4.2 Roles
#### Admin
* Full access to `/admin`
* Create / Edit / Delete posts
* Manage categories, tags, and comments

#### User
* Can login only (Profile management, view comments)
* No content publishing permissions

### 4.3 Route Protection
* Block unauthorized access to `/admin`
* Redirect non-admin users

---

## 5. Content Rules & SEO Validation

### 5.1 Markdown Rules
* H1 = Article title ONLY. DO NOT use H1 inside the body content.
* Structure:
  * `##` → Main sections
  * `###` → Subsections

### 5.2 Validation Rules
* Minimum requirement: 3 H2 headings.
* Clear hierarchical structure is required.

### 5.3 SEO Fields (Required)
Mỗi bài viết khi tạo trên CMS đều phải bao gồm và agent cần nhắc/nhập đầy đủ:
* **URL Slug**
* **Meta Title**: Phải dài khoảng 50-60 ký tự, riêng biệt và tối ưu hoá click hơn (có thể khác với H1).
* **Meta Description**: Phải dài khoảng 150-160 ký tự.
* **Excerpt**: Nội dung tóm tắt để hiển thị ở trang chủ / category.
* **isIndexed & canonicalUrl**: Dành cho quản lý các phiên bản nội dung và index nâng cao.

### 5.4 E-E-A-T Rules
* Mọi bài viết đều phải gắn với tác giả hợp lệ.
* Schema `User` bắt buộc phải có `bio` (tiểu sử chuyên môn) và `avatar` để hiển thị trong Author Box, củng cố yếu tố Chuyên gia và Đáng tin cậy cho nội dung liên quan tới sức khoẻ mẹ & bé.

### 5.5 Product Review Rules
* Nếu bài viết là dạng đánh giá sản phẩm (Product Review), phải có `reviewData` JSON chứa (rating, pros, cons, affiliateLink).
* Bắt buộc hiển thị bảng so sánh (ưu/nhược).
* Bắt buộc Inject Product Rating vào JSON-LD.

### 5.6 Image SEO
* Alt text is **mandatory** for every image.

---

## 6. Technical SEO & Performance

### 6.1 Core Web Vitals Targets
* LCP < 2.5s
* CLS < 0.1

### 6.2 Image Optimization
* Auto convert to WebP / AVIF (using next/image and Sharp).
* Lazy loading enabled natively.

### 6.3 Structured Data (JSON-LD)
Automatically inject using Next.js Metadata API or explicit `<script type="application/ld+json">`:
* Article
* Product & Review (For product review posts)
* FAQ
* Breadcrumb
* ProfilePage (For Author page)

### 6.4 SEO Infrastructure
* Auto-generate `sitemap.xml` / `robots.txt` via Next.js metadata route files.

---

## 7. Suggested Enhancements
* Tag system for internal linking (n-n with Post) - **Included**
* Caching layer (Redis or Next.js fetch cache/ISR)
* Analytics integration (GA4, Search Console)
* Content scoring system (SEO Score validation at CMS level)

---

## 8. Development Priorities

### Phase 1 (Core)
* Public pages (Homepage, Category, Article)
* Basic CMS (CRUD posts, User management)
* Database schema with Prisma
* Markdown rendering with basic tags

### Phase 2
* SEO features (Meta API, JSON-LD Schema, Sitemap)
* Rich E-E-A-T implementation (Author specific pages/boxes)
* TOC generation

### Phase 3
* Product reviews feature (JSON Data, Comparison tables)
* Mini tools
* Advanced performance optimization

---

## 9. Success Criteria
* Pages strictly indexed by Google (with canonicals appropriately set).
* Achieve ranking for mother & baby niche keywords.
* Fast loading performance.
* Clean, E-E-A-T compliant structured content.

---
**End of Document**
