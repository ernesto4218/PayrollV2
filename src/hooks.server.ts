import { verifyToken } from "$lib/server/db/utils/jwt";
import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";

const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/accountant": ["accountant"],
};

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("token");

  if (token) {
    const payload = verifyToken(token);
    event.locals.user = payload as App.Locals["user"];
  } else {
    event.locals.user = null;
  }

  const path = event.url.pathname;

  const matchedRoute = Object.keys(ROLE_ROUTES).find(route =>
    path.startsWith(route)
  );

  if (matchedRoute) {
    if (!event.locals.user) redirect(302, "/login");

    const allowedRoles = ROLE_ROUTES[matchedRoute];
    if (!allowedRoles.includes(event.locals.user.role)) {
      redirect(302, "/unauthorized");
    }
  }

  return resolve(event);
};