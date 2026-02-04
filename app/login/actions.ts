"use server";

import { z } from "zod";
import { setSession, deleteSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(formData: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  // Simple hardcoded check
  if (email === "admin@faultee.com" && password === "admin123") {
    await setSession({ email });
    return { success: true };
  }

  return { error: "Invalid email or password" };
}

export async function logout() {
  // This would import deleteSession from "@/lib/auth" but since it's "use server"
  // we can just use the cookie store directly or import it.
  // For consistency, let's use the helper.
  await deleteSession();
}
