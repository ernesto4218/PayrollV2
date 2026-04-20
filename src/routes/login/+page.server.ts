import { login } from "$lib/server/db/services/login.services";
import { signToken } from "$lib/server/db/utils/jwt";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const id = data.get("employeeId") as string;
    const password = data.get("password") as string;

    const user = await login(id, password);
    
    if (!user) {
      return { error: "Invalid credentials." };
    }

    const token = signToken({ id: user.employee_id, first_name: user.first_name, middle_name: user.middle_name, last_name: user.last_name, role: user.role });

    cookies.set("token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 60 * 60 * 24
    });

    if (user.role === "admin") redirect(302, "/admin");
    if (user.role === "accountant") redirect(302, "/accountant/dashboard"); 
    redirect(404, "/404");
  }
};