"use server";

import { z } from "zod";
import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../lib/auth";

const LoginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function loginAction(formData: unknown) {
  const parsed = LoginSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { username, password } = parsed.data;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    return { success: false, error: "Konfigurasi admin belum diset" };
  }

  if (username !== adminUsername) {
    return { success: false, error: "Username atau password salah" };
  }

  const isValid = await compare(password, adminPasswordHash);
  if (!isValid) {
    return { success: false, error: "Username atau password salah" };
  }

  await createSession();
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
