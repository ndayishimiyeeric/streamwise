import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export default authMiddleware;
