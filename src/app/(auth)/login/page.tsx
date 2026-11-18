"use client";
import { signIn } from "next-auth/react";
import { Input } from "@base-ui/react";
import { useForm, Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import {
  FaGoogle,
  FaFacebook,
  FaTruck,
  FaShieldHalved,
  FaClock,
  FaEnvelope,
  FaLock,
  FaUsers,
  FaStar,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { LoginSchemaType, myLoginSchemas } from "@/schemas/auth.schemas";
import { UserLogin } from "@/actions/auth.actions";
import img8 from "../../../assets/pictures/login-image.png";
import { Button } from "@/components/ui/button";

export default function Login() {
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(myLoginSchemas),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // UI only — NOT sent to API

  const { handleSubmit, control } = form;

  async function myLogin(data: LoginSchemaType) {
    console.log(data);
    //validation ==> done
    //call api

    const responses = await signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl: "/",
    });
    console.log(responses);
    // const result = await UserLogin(data);
    // const res = await fetch(`http://localhost:3000/api/brands`);
    // const myData = await res.json();
    // console.log(myData);

    if (responses?.ok) {
      toast.add({
        type: "success",
        description: "you logged successfully 😉",
      });
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } else {
      toast.add({
        type: "error",
        description:
          "there problem in login see problem ( wrong password or wrong email ) , then try again 😥",
      });
    }
  }

  return (
    <>
      <main className="container py-16 mx-auto px-4" id="login-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* ===== LEFT COLUMN (hidden on mobile, demo verbatim) ===== */}
          <div className="hidden lg:block">
            <div className="text-center space-y-6">
              <img
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                alt="fresh vegetables and fruits shopping cart illustration, modern clean style, green theme"
                src={img8.src}
              />
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  FreshCart - Your One-Stop Shop for Fresh Products
                </h2>
                <p className="text-lg text-gray-600">
                  Join thousands of happy customers who trust FreshCart for
                  their daily grocery needs
                </p>
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaTruck className="text-green-600 mr-2" />
                    Free Delivery
                  </div>
                  <div className="flex items-center">
                    <FaShieldHalved className="text-green-600 mr-2" />
                    Secure Payment
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-green-600 mr-2" />
                    24/7 Support
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN (form card) ===== */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    Fresh<span className="text-gray-800">Cart</span>
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome Back!
                </h1>
                <p className="text-gray-600">
                  Sign in to continue your fresh shopping experience
                </p>
              </div>

              {/* Social Login Buttons (stacked full-width like demo) */}
              <div className="space-y-3 mb-6">
                <Button
                  variant="ghost"
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <FaGoogle className="text-red-500 text-lg" />
                  <span className="font-medium text-gray-700">
                    Continue with Google
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <FaFacebook className="text-blue-600 text-lg" />
                  <span className="font-medium text-gray-700">
                    Continue with Facebook
                  </span>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    OR CONTINUE WITH EMAIL
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(myLogin)} className="space-y-6">
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "Email is required" }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="emailInput"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email Address
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                          type="email"
                          {...field}
                          id="emailInput"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your email"
                          autoComplete="email"
                        />
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required" }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between mb-2">
                        <FieldLabel
                          htmlFor="passwordInput"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Password
                        </FieldLabel>
                        {/* TODO: create /forget-password page later */}
                        <Link
                          href="/forget-password"
                          className="text-sm text-green-600 hover:text-green-700 cursor-pointer font-medium"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                          {...field}
                          id="passwordInput"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                        />
                        <FaLock className="absolute left-4 top-1/2  text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Remember me (UI only — not part of schema/API) */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-green-600 accent-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Keep me signed in
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign In
                </Button>
              </form>

              {/* Footer Link */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-600">
                  New to FreshCart?
                  <Link
                    href="/register"
                    className="text-green-600 hover:text-green-700 ms-2 font-semibold cursor-pointer"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <FaLock className="mr-1" />
                  SSL Secured
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-1" />
                  50K+ Users
                </div>
                <div className="flex items-center">
                  <FaStar className="mr-1" />
                  4.9 Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
