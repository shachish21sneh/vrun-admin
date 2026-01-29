import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticationApi } from "@/toolkit/auth/auth.api";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setUser } from "@/toolkit/common/common.slice";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleProtectRoute } from "@/lib/protectRoute";

export default function SignInViewPage() {
  const { useAuthLoginWithPasswordMutation } = authenticationApi;
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useAuthLoginWithPasswordMutation();

  const [loading, setLoading] = useState(false); // Loading state for the button

  // Define Zod schema for validation
  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  // Setup React Hook Form with Zod validation
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit Handler
  const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
    setLoading(true); // Set loading to true on submit
    try {
      const response = await login({ email, password });
      if (response) {
        dispatch(setUser(response));
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        "Failed to login. Please check your credentials and try again."
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="flex flex-col justify-center items-center w-full h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            src="/vrun-logo.jpg"
            alt="logo"
            width={100}
            height={100}
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="mt-6 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loader">Loading...</span>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const resp = await handleProtectRoute(context);
  return resp;
}
