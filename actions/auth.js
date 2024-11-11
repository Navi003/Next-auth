"use server";

import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hashpassword";
import { createUser, getUserbyEmail } from "@/lib/user";
import { Lucia } from "lucia";
import { cookies } from "next/headers";
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
  console.log("----- WRON PLACE");
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

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserbyEmail(email);

  console.log(existingUser);

  if (!existingUser) {
    return {
      errors: {
        email: "could not find Email Crenedntials",
      },
    };
  }

  const isValidpassword = verifyPassword(existingUser.password, password);

  if (!isValidpassword) {
    return {
      errors: {
        email: "could not find Email Crenedntials",
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect("/training");
}

export async function auth(mode, prevState, formData) {
  console.log(mode);
  if (mode === "login") {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout() {
  await destroySession();
  redirect("/");
}
