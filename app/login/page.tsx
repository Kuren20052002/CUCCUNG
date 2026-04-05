"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { clsx } from "clsx"
import { Lock, Mail, Baby, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  // 1. Xử lý thông báo lỗi từ URL (ví dụ: bị đá ra từ trang Admin)
  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "AccessDenied") {
      toast.error("Tài khoản của bạn không có quyền truy cập khu vực này.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Quan trọng: không redirect tự động để ta xử lý logic điều hướng
      })

      if (result?.error) {
        toast.error("Email hoặc mật khẩu không chính xác")
        setIsLoading(false)
        return
      }

      toast.success("Đăng nhập thành công!")

      // 2. Logic Điều hướng thông minh dựa trên Role
      // Ta fetch lại session mới nhất để lấy Role
      const res = await fetch("/api/auth/session")
      const updatedSession = await res.json()

      const userRole = updatedSession?.user?.role
      const callbackUrl = searchParams.get("callbackUrl")

      if (callbackUrl) {
        // Kiểm tra quyền: nếu là trang Admin mà user không phải ADMIN thì về Home
        if (callbackUrl.startsWith("/admin") && userRole !== "ADMIN") {
          router.push("/")
        } else {
          router.push(callbackUrl)
        }
      } else {
        // Không có callback thì về trang chủ hoặc admin tuỳ role
        router.push(userRole === "ADMIN" ? "/admin" : "/")
      }

      router.refresh()
    } catch (err) {
      toast.error("Hệ thống đang bận. Vui lòng thử lại sau.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_left,_#fff5f7_0%,_#f0f7ff_100%)] overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-white rounded-3xl shadow-xl mb-4 transition-transform hover:scale-105 duration-300">
            <Baby className="w-12 h-12 text-pink-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Mừng bạn quay lại!</h1>
          <p className="text-gray-500 mt-2 font-medium">Cộng đồng Mẹ & Bé Cưng</p>
        </div>

        {/* Card Login */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Email của mẹ</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-400 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all"
                  placeholder="vi-du@gmail.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">Mật khẩu</label>
                <Link href="/forgot-password" size="sm" className="text-xs text-pink-500 hover:underline font-semibold">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                "w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2",
                isLoading
                  ? "bg-pink-300 cursor-wait"
                  : "bg-gradient-to-r from-pink-400 to-rose-400 hover:shadow-pink-200 hover:scale-[1.02] active:scale-95"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Vào cộng đồng ngay</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Card */}
          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              Mẹ chưa có tài khoản?{" "}
              <Link href="/signup" className="text-pink-500 hover:underline font-bold">
                Tham gia ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>Cần hỗ trợ kỹ thuật?</span>
          <a href="mailto:admin@cuccung.vn" className="text-pink-400 hover:underline font-semibold">Gửi thư cho chúng mình</a>
        </div>
      </div>
    </div>
  )
}