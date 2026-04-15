"use client"

import { useState, Suspense } from "react" // 1. Thêm Suspense
import { useRouter } from "next/navigation"
import { clsx } from "clsx"
import { Lock, Mail, Baby, ArrowRight, Eye, EyeOff, User } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { registerUser } from "@/app/actions/register"

// Tách logic Form ra Component riêng
function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }

    setIsLoading(true)

    try {
      const result = await registerUser({ email, password, name })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.success || "Đăng ký thành công! Xin vui lòng đăng nhập lại")
        router.push("/login")
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-svh flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_left,_#fff5f7_0%,_#f0f7ff_100%)] overflow-y-auto overflow-x-hidden scrollbar-hide font-sans">
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-md py-8">
        <div className="flex flex-col items-center mb-8 animate-fade-in-down">
          <div className="p-4 bg-white rounded-3xl shadow-xl shadow-pink-100/50 mb-4 transform hover:scale-110 transition-transform duration-300">
            <Baby className="w-12 h-12 text-pink-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Tham gia với chúng tôi</h1>
          <p className="text-gray-500 mt-2">Dành cho cộng đồng Mẹ & Bé ngoanxinhyeu</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-white animate-fade-in">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Họ và tên</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-400 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all duration-300"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all duration-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-pink-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Xác nhận mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                "w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-pink-200 transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden relative",
                isLoading ? "bg-pink-300 cursor-not-allowed" : "bg-gradient-to-r from-pink-400 to-pink-300 hover:from-pink-500 hover:to-pink-400 active:scale-95"
              )}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Đăng ký</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-pink-400 hover:underline font-bold transition-all">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-400 text-xs">
          &copy; 2026 ngoanxinhyeu Website. All rights reserved.
        </p>
      </div>
    </div>
  )
}

// Component chính export ra ngoài
export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}