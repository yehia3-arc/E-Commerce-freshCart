"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@base-ui/react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { ImSpinner10 } from "react-icons/im";
import {
  FaEnvelope,
  FaKey,
  FaLock,
  FaCheck,
  FaShieldHalved,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";
import {
  forgotEmailSchema,
  ForgotEmailType,
  resetCodeSchema,
  ResetCodeType,
  newPasswordSchema,
  NewPasswordType,
} from "@/schemas/auth.schemas";
import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "@/actions/auth.actions";

export default function ForgetPassword() {
  const isOk = (r: any) =>
    String(r?.status).toLowerCase() === "success" ||
    String(r?.message).toLowerCase() === "success" ||
    (typeof r?.httpStatus === "number" &&
      r.httpStatus >= 200 &&
      r.httpStatus < 300);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const SEND_COOLDOWN = 20; // seconds between code requests
  const MAX_ATTEMPTS = 5; // requests per session before a temporary lock
  const LOCK_SECONDS = 60;
  const [attempts, setAttempts] = useState(0);
  const emailForm = useForm<ForgotEmailType>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotEmailSchema),
  });
  const codeForm = useForm<ResetCodeType>({
    defaultValues: { resetCode: "" },
    resolver: zodResolver(resetCodeSchema),
  });
  const pwdForm = useForm<NewPasswordType>({
    defaultValues: { newPassword: "", confirmPassword: "" },
    resolver: zodResolver(newPasswordSchema),
  });
  async function onEmail(data: ForgotEmailType) {
    if (busy || cooldown > 0) return;
    if (attempts >= MAX_ATTEMPTS) {
      setCooldown(LOCK_SECONDS);
      toast.add({
        type: "error",
        description: "Too many requests. Please wait before trying again.",
      });
      return;
    }
    // when any cooldown/lock window finishes, give the user a fresh allowance

    setBusy(true);
    setAttempts((a) => a + 1);
    const res = await forgotPassword(data.email); // ✅ the ONLY request
    setBusy(false);

    if (res?.httpStatus === 429) {
      setCooldown(Number(res?.retryAfter) || SEND_COOLDOWN);
      toast.add({
        type: "error",
        description: "Too many requests. Please wait before trying again.",
      });
      return;
    }
    if (isOk(res)) {
      setAttempts(0);
      setEmail(data.email);
      codeForm.reset({ resetCode: "" });
      setStep(2);
      setCooldown(SEND_COOLDOWN);
      toast.add({
        type: "success",
        description: "Reset code sent to your email 📧",
      });
    } else {
      // API itself says "no user with this email" → stay on step 1
      toast.add({
        type: "error",
        description: "If an account exists with that email address, try again",
      });
    }
  }
  // 40s resend cooldown (client-side UX limit)
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);
  useEffect(() => {
    if (cooldown === 0) setAttempts(0);
  }, [cooldown]);
  // ✅ anti-enumeration: same message/flow whether or not the email exists
  async function resend() {
    if (busy || cooldown > 0) return;
    setBusy(true);
    const res = await forgotPassword(email);
    setBusy(false);
    if (isOk(res)) {
      setAttempts(0);
      setCooldown(SEND_COOLDOWN);
      codeForm.reset({ resetCode: "" });
      toast.add({
        type: "success",
        description: "A new code has been sent 📧",
      });
    } else {
      toast.add({
        type: "error",
        description: res?.message || "Couldn't resend the code 😥",
      });
    }
  }
  async function onCode(data: ResetCodeType) {
    setBusy(true);
    const res = await verifyResetCode(data.resetCode);
    console.log("verifyResetCode response:", res); // ✅ shows the API's exact message
    setBusy(false);
    if (isOk(res)) {
      setStep(3);
      setAttempts(0);
      toast.add({ type: "success", description: "Code verified ✅" });
    } else {
      toast.add({
        type: "error",
        description: res?.message || "invalid or expired code 😥",
      });
    }
  }

  async function onReset(data: NewPasswordType) {
    setBusy(true);
    const res = await resetPassword(email, data.newPassword);
    setBusy(false);
    if (res?.status === "success" || res?.message === "success" || res?.token) {
      setStep(4);
      toast.add({
        type: "success",
        description: "Password reset successfully 🎉",
      });
    } else {
      toast.add({
        type: "error",
        description: res?.message || "failed to reset password 😥",
      });
    }
  }

  const eye = (shown: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {shown ? <FaEyeSlash /> : <FaEye />}
    </button>
  );

  const steps = [
    { Icon: FaEnvelope, done: step > 1, active: step === 1 },
    { Icon: FaKey, done: step > 2, active: step === 2 },
    { Icon: FaLock, done: step > 3, active: step === 3 },
  ];

  return (
    <main className="container py-16 mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        {/* ===== left illustration (Figma) ===== */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="w-full h-96 bg-linear-to-br from-green-50 via-green-50 to-emerald-50 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-8 left-8 w-24 h-24 rounded-full bg-green-100/50" />
              <div className="absolute bottom-12 right-10 w-32 h-32 rounded-full bg-green-100/50" />
              <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-emerald-100/50" />
              <div className="relative flex flex-col items-center gap-6 z-10">
                <div className="w-28 h-28 rounded-3xl bg-white shadow-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center">
                    <FaLock className="text-green-600 text-4xl" />
                  </div>
                </div>
                <div className="absolute -left-16 top-4 w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center -rotate-12">
                  <FaEnvelope className="text-green-500 text-xl" />
                </div>
                <div className="absolute -right-16 top-8 w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center rotate-12">
                  <FaShieldHalved className="text-green-500 text-xl" />
                </div>
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse [animation-delay:150ms]" />
                  <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Reset Your Password
              </h2>
              <p className="text-lg text-gray-600">
                Don't worry, it happens to the best of us. We'll help you get
                back into your account in no time.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <span className="flex items-center">
                  <FaEnvelope className="text-green-600 mr-2" /> Email
                  Verification
                </span>
                <span className="flex items-center">
                  <FaShieldHalved className="text-green-600 mr-2" /> Secure
                  Reset
                </span>
                <span className="flex items-center">
                  <FaLock className="text-green-600 mr-2" /> Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== right card ===== */}
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <span className="text-3xl font-bold text-green-600">
                Fresh<span className="text-gray-800">Cart</span>
              </span>
              <h1 className="text-2xl font-bold text-gray-800 mb-2 mt-4">
                {step === 1 && "Forgot Password?"}
                {step === 2 && "Check Your Email"}
                {step === 3 && "Create New Password"}
                {step === 4 && "Password Reset!"}
              </h1>
              <p className="text-gray-600">
                {step === 1 && "No worries, we'll send you a reset code"}
                {step === 2 && `Enter the 6-digit code sent to ${email}`}
                {step === 3 &&
                  "Your new password must be different from previous passwords"}
                {step === 4 &&
                  "Your password has been successfully reset. You can now sign in with your new password."}
              </p>
            </div>

            {/* stepper */}
            {step < 4 && (
              <div className="flex items-center justify-center mb-8">
                {steps.map(({ Icon, done, active }, i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        done || active
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      } ${active ? "ring-4 ring-green-100" : ""}`}
                    >
                      {done ? <FaCheck /> : <Icon className="text-xs" />}
                    </div>
                    {i < 2 && (
                      <div
                        className={`w-16 h-0.5 mx-2 transition-all duration-300 ${step > i + 1 ? "bg-green-600" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ===== STEP 1: email ===== */}
            {step === 1 && (
              <form
                onSubmit={emailForm.handleSubmit(onEmail)}
                className="space-y-6"
              >
                <Controller
                  name="email"
                  control={emailForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email Address
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                          autoComplete="email"
                          {...field}
                        />
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <button
                  type="submit"
                  disabled={busy || cooldown > 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {busy && <ImSpinner10 className="animate-spin" />}
                  {busy
                    ? "Sending..."
                    : cooldown > 0
                      ? `Send Reset Code (${cooldown}s)`
                      : "Send Reset Code"}
                </button>
                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    <FaArrowLeft className="text-xs" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}

            {/* ===== STEP 2: code ===== */}
            {step === 2 && (
              <form
                onSubmit={codeForm.handleSubmit(onCode)}
                className="space-y-6"
              >
                <Controller
                  name="resetCode"
                  control={codeForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="resetCode"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Verification Code
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id="resetCode"
                          type={showCode ? "text" : "password"} // ✅ masked by default
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="••••••"
                          autoComplete="one-time-code"
                          className={`w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all pr-12 text-center text-2xl  `}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                        />
                        <FaShieldHalved className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        {eye(showCode, () => setShowCode(!showCode))}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      disabled={cooldown > 0 || busy}
                      onClick={resend}
                      className="text-green-600 hover:text-green-700 font-semibold transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {cooldown > 0
                        ? `Resend Code (${cooldown}s)`
                        : "Resend Code"}
                    </button>
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {busy && <ImSpinner10 className="animate-spin" />} Verify Code
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 font-medium transition-colors"
                  >
                    <FaArrowLeft className="text-xs" /> Change email address
                  </button>
                </div>
              </form>
            )}

            {/* ===== STEP 3: new password ===== */}
            {step === 3 && (
              <form
                onSubmit={pwdForm.handleSubmit(onReset)}
                className="space-y-6"
              >
                <Controller
                  name="newPassword"
                  control={pwdForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="newPassword"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        New Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNew ? "text" : "password"}
                          placeholder="Enter new password"
                          className={`w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all pr-12`}
                          autoComplete="new-password"
                          {...field}
                        />
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        {eye(showNew, () => setShowNew(!showNew))}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={pwdForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="confirmPassword"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Confirm Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="Confirm new password"
                          className={`w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all pr-12`}
                          autoComplete="new-password"
                          {...field}
                        />
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        {eye(showConfirm, () => setShowConfirm(!showConfirm))}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {busy && <ImSpinner10 className="animate-spin" />} Reset
                  Password
                </button>
              </form>
            )}

            {/* ===== STEP 4: success ===== */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                  <FaCheck className="text-2xl" />
                </div>
                <Link
                  href="/login"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Back to Sign In
                </Link>
              </div>
            )}

            {step === 1 && (
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-600">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
