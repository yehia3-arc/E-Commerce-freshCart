"use client";

import { Input } from "@base-ui/react";
import { useForm, Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import * as zod from "zod";
import Link from "next/link";
import {
  FaUserPlus,
  FaGoogle,
  FaFacebook,
  FaStar,
  FaTruckFast,
  FaShieldHalved,
  FaRegEye, // ADD THIS
  FaRegEyeSlash, // ADD THIS
} from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { myRegisterSchemas, RegisterSchemaType } from "@/schemas/auth.schemas";

import img5 from "../../../assets/pictures/image.png";
import { UserRegister } from "@/actions/auth.actions";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      terms: false,
    },
    resolver: zodResolver(myRegisterSchemas),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  function getStrength(password: string) {
    if (!password) return { width: "0%", color: "bg-gray-200", label: "" };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { width: "20%", color: "bg-red-500", label: "Weak" };
    if (score <= 3)
      return { width: "45%", color: "bg-orange-500", label: "Fair" };
    if (score <= 4)
      return { width: "70%", color: "bg-blue-500", label: "Good" };
    return { width: "90%", color: "bg-green-500", label: "Strong" };
  }
  const { handleSubmit, control, register } = form;
  const passwordValue = form.watch("password");
  const strength = getStrength(passwordValue);

  async function mySubmit(data: RegisterSchemaType) {
    console.log(data);
    //validation ==> done
    //call api

    const res = await UserRegister(data);
    if (res.ok) {
      toast.add({
        type: "success",
        description: res.message,
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      const dup =
        /already|in use/i.test(res.message ?? "") || res.status === 409;
      if (dup)
        form.setError("email", {
          message: "This email is already registered — sign in instead.",
        });
      toast.add({ type: "error", description: res.message });
    }
  }

  return (
    <>
      <main className="py-10">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-4">
          {/* LEFT COLUMN - Missing content */}
          <div>
            <h1 className="text-4xl font-bold">
              Welcome to <span className="text-green-600">FreshCart</span>
            </h1>
            <p className="text-xl mt-2 mb-4 text-gray-600">
              Join thousands of happy customers who enjoy fresh groceries
              delivered right to their doorstep.
            </p>

            {/* Feature list with icons */}
            <ul className="space-y-6 my-8">
              <li className="flex items-start gap-4">
                <div className="size-12 text-lg bg-green-100 text-green-600 rounded-full flex justify-center items-center shrink-0">
                  <FaStar />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Premium Quality</h2>
                  <p className="text-gray-600">
                    Premium quality products sourced from trusted suppliers.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="size-12 text-lg bg-green-100 text-green-600 rounded-full flex justify-center items-center shrink-0">
                  <FaTruckFast />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Fast Delivery</h2>
                  <p className="text-gray-600">
                    Same-day delivery available in most areas
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="size-12 text-lg bg-green-100 text-green-600 rounded-full flex justify-center items-center shrink-0">
                  <FaShieldHalved />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Secure Shopping</h2>
                  <p className="text-gray-600">
                    Your data and payments are completely secure
                  </p>
                </div>
              </li>
            </ul>

            {/* Review card */}
            <div className="review bg-white shadow-sm p-4 rounded-md border border-gray-100">
              <div className="author flex items-center gap-4 mb-4">
                <div className="size-12 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                  <img
                    src={img5.src}
                    alt="Sarah Johnson"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">Sarah Johnson</h3>
                  <div className="flex gap-0.5 text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
              <blockquote>
                <p className="italic text-gray-600">
                  "FreshCart has transformed my shopping experience. The quality
                  of the products is outstanding, and the delivery is always on
                  time. Highly recommend!"
                </p>
              </blockquote>
            </div>
          </div>

          {/* RIGHT COLUMN - Your existing register form */}
          <div className="bg-white rounded-2xl shadow-lg px-6 py-10">
            {/* Header */}
            <h2 className="text-center text-3xl font-semibold mb-2 text-gray-900 ">
              Create Your Account
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Start your fresh journey with us today
            </p>

            {/* Social Login Buttons */}
            <div className="flex gap-2 *:grow my-6">
              <button
                type="button"
                className="bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-4 rounded-lg transition-colors"
                aria-label="Sign up with Google"
              >
                <FaGoogle className="me-2 text-red-600" />
                <span className="text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-4 rounded-lg transition-colors"
                aria-label="Sign up with Facebook"
              >
                <FaFacebook className="me-2 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Facebook
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative w-full h-0.5 bg-gray-300/30 my-6 flex items-center">
              <span className="sr-only">or</span>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-500 text-sm">
                or
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(mySubmit)} className="space-y-7">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-2"
                  >
                    <FieldLabel htmlFor="nameInput">Name*</FieldLabel>
                    <Input
                      className="w-full px-4 py-2 rounded-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      type="text"
                      {...field}
                      id="nameInput"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ali"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="emailInput">Email*</FieldLabel>
                    <Input
                      className="w-full px-4 py-2 rounded-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      type="email"
                      {...field}
                      id="emailInput"
                      aria-invalid={fieldState.invalid}
                      placeholder="ali@example.com"
                      autoComplete="email"
                    />
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
                    <FieldLabel htmlFor="passwordInput">Password*</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-2 rounded-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                        {...field}
                        id="passwordInput"
                        aria-invalid={fieldState.invalid}
                        placeholder="create a strong password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

                    {/* Password Strength Indicator */}

                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="grow h-1 bg-gray-200 rounded-md overflow-hidden"
                          role="progressbar"
                          aria-valuenow={parseInt(strength.width)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Password strength: ${strength.label}`}
                        >
                          <div
                            className={`${strength.color} h-full rounded-md transition-all duration-300 ease-out`}
                            style={{ width: strength.width }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium min-w-12.5 text-gray-700">
                          {strength.label}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        Must be at least 8 characters with numbers and symbols
                      </p>
                    </div>
                  </Field>
                )}
              />

              <Controller
                name="rePassword"
                control={control}
                rules={{ required: "Confirm Password is required" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="rePasswordInput">
                      Confirm Password*
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        type={showRePassword ? "text" : "password"}
                        className="w-full px-4 py-2 rounded-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                        {...field}
                        id="rePasswordInput"
                        aria-invalid={fieldState.invalid}
                        placeholder="confirm your password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRePassword(!showRePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={
                          showRePassword ? "Hide password" : "Show password"
                        }
                      >
                        {showRePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={control}
                // rules={{ required: "Phone is required" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phoneInput">Phone Number*</FieldLabel>
                    <Input
                      className="w-full px-4 py-2 rounded-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      type="tel"
                      {...field}
                      id="phoneInput"
                      aria-invalid={fieldState.invalid}
                      placeholder="write your egyptian phone number"
                      autoComplete="tel"
                      onChange={(e) => {
                        // \D matches any non-digit character. We replace it with nothing ("").
                        const numericValue = e.target.value.replace(/\D/g, "");
                        field.onChange(numericValue); // Update react-hook-form with only numbers
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="size-4 accent-green-600 mt-1"
                  {...register("terms", {
                    required: "You must agree to the terms",
                  })}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-tight"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-green-600 hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>{" "}
                  *
                </label>
              </div>
              {form.formState.errors.terms && (
                <p className="text-xs text-red-500 -mt-3">
                  {form.formState.errors.terms.message}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <FaUserPlus />
                <span>Create My Account</span>
              </button>
            </form>

            {/* Footer Link */}
            <p className="border-t border-gray-300/30 mt-8 pt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
// server action  ==> run all non get request  on the server  ==> and we can call inside client component (run in browser)
//post,put ,delete , patch
