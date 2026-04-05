"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const RegisterSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  name: z.string().min(1, { message: "Tên không được để trống" }),
})

export async function registerUser(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ" }
  }

  const { email, password, name } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Email đã được sử dụng" }
  }

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER" // Default role
      },
    })

    return { success: "Tạo tài khoản thành công!" }
  } catch (error) {
    return { error: "Đã có lỗi xảy ra. Vui lòng thử lại." }
  }
}
