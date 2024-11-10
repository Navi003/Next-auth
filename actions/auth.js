"use server";

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword } from "@/lib/hashpassword";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";

//FormData is 2nd argument
export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be atleast 8 charachters long";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  // Store it in Data base
  const hashedPassword = hashUserPassword(password);

  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "It Seems like an account for the chosen email already Exists",
        },
      };
    }

    throw error;
  }
}
