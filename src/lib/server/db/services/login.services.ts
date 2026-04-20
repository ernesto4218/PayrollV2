import { getUserById } from "../repositories/user.repo";
import { comparePassword } from "../utils/hash";

export async function login(id: string, password: string) {
  const user = await getUserById(id);

  console.log("Fetched id: ", id);
  console.log("Fetched pass: ", password);
  console.log("Fetched user: ", user);
  
  if (!user) return null;
  const correct = await comparePassword(password, user.password_hash);
  if (!correct) return null;

  return user;
}