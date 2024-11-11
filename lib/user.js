import { lucia } from "lucia";
import { veridyAuth } from "./auth";
import db from "./db";

export function createUser(email, password) {
  const result = db
    .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
    .run(email, password);

  return result.lastInsertRowid;
}

export function getUserbyEmail(email) {
  console.log(email);
  db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}
