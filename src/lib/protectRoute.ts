import type { GetServerSidePropsContext } from "next";
import { hasCookie } from "cookies-next";
import { V_AUTH_TOKEN } from "@/constants/stringConstants";
export const handleProtectRoute = async (
  context: GetServerSidePropsContext,
  // role?: string
) => {
  const isPublicRoute = ["/login"].includes(context.resolvedUrl);
  const isTokenSet = hasCookie(V_AUTH_TOKEN, context);
  //redirect to access route if user is already logged in and tries to access public route like /login
  if (isPublicRoute && isTokenSet) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  } else if (!isTokenSet && !isPublicRoute) {
    //redirect to login route if user tries to access private route without login
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};
