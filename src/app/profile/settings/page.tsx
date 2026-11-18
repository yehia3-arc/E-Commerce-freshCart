"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import PageHeader from "@/app/_components/PageHeader/PageHeader";
import { toast } from "@/components/ui/toast";
import { ImSpinner10 } from "react-icons/im";
import {
  FaUser,
  FaLocationDot,
  FaGear,
  FaChevronRight,
  FaFloppyDisk,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@base-ui/react";
import {
  updateLoggedUserData,
  updateLoggedUserPassword,
} from "@/actions/user.actions";
import {
  myProfileSchemas,
  myPasswordSchemas,
  ProfileSchemaType,
  PasswordSchemaType,
} from "@/schemas/auth.schemas";

export default function SettingsPage() {
  const { data: session, status } = useSession();

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  // UI-only: password visibility toggles
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  // ===== Profile form (keys sent to API: name, email, phone) =====
  const profileForm = useForm<ProfileSchemaType>({
    defaultValues: { name: "", email: "", phone: "" },
    resolver: zodResolver(myProfileSchemas),
  });

  // ===== Password form (keys sent to API: currentPassword, newPassword) =====
  const passwordForm = useForm<PasswordSchemaType>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(myPasswordSchemas),
  });

  // Prefill profile from session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      profileForm.reset({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        phone: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  const onInvalid = () =>
    toast.add({
      type: "error",
      description: "please fix the highlighted fields 😐",
    });

  async function onProfileValid(data: ProfileSchemaType) {
    setSavingProfile(true);
    const res = await updateLoggedUserData(data);
    if (res.status === "success") {
      toast.add({
        type: "success",
        description: "profile updated successfully 😊",
      });
    } else {
      toast.add({
        type: "error",
        description: res.message || "failed to update profile 😥",
      });
    }
    setSavingProfile(false);
  }

  async function onPwdValid(data: PasswordSchemaType) {
    setSavingPwd(true);
    const res = await updateLoggedUserPassword({
      currentPassword: data.currentPassword,
      password: data.newPassword, // ✅ zod field newPassword → API key password
      rePassword: data.confirmPassword, // ✅ zod field confirmPassword → API key rePassword
    });
    if (res.status === "success" || !!res.token) {
      // API returns a NEW token after password change → refresh session/cookie
      await signIn("credentials", {
        email: session?.user?.email,
        password: data.newPassword,
        redirect: false,
      });
      toast.add({
        type: "success",
        description: "password changed successfully 🔒",
      });
      passwordForm.reset();
    } else {
      toast.add({
        type: "error",
        description: "failed to change password 😥",
      });
    }
    setSavingPwd(false);
  }

  const toggleEye = (k: keyof typeof show) =>
    setShow((s) => ({ ...s, [k]: !s[k] }));

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all";
  const pwdCls = `${inputCls} pr-12`;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="My Account"
        subtitle="Manage your addresses and account settings"
        icon={FaUser}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ===== Sidebar (Settings active) ===== */}
          <aside className="w-full lg:w-72 shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">My Account</h2>
              </div>
              <ul className="p-2">
                <li>
                  <Link
                    href="/profile/addresses"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-gray-100 text-gray-500 group-hover:bg-gray-200">
                      <FaLocationDot className="text-sm" />
                    </div>
                    <span className="font-medium flex-1">My Addresses</span>
                    <FaChevronRight className="text-xs text-gray-400" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group bg-green-50 text-green-700"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-600 text-white">
                      <FaGear className="text-sm" />
                    </div>
                    <span className="font-medium flex-1">Settings</span>
                    <FaChevronRight className="text-xs text-green-500" />
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Account Settings
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Update your profile information and change your password
                </p>
              </div>

              {/* ===== Profile card ===== */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                      <FaUser className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Profile Information
                      </h3>
                      <p className="text-sm text-gray-500">
                        Update your personal details
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={profileForm.handleSubmit(
                      onProfileValid,
                      onInvalid,
                    )}
                    className="space-y-5"
                  >
                    <Controller
                      name="name"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Full Name
                          </FieldLabel>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            className={inputCls}
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="email"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Email Address
                          </FieldLabel>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className={inputCls}
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="phone"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Phone Number
                          </FieldLabel>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="01xxxxxxxxx"
                            className={inputCls}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\D/g, ""))
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg shadow-green-600/25"
                      >
                        {savingProfile ? (
                          <ImSpinner10 className="animate-spin" />
                        ) : (
                          <FaFloppyDisk />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Account Information */}
                <div className="p-6 sm:p-8 bg-gray-50">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Account Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">User ID</span>
                      <span className="font-mono text-gray-700">
                        {session?.user?.id ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Role</span>
                      <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-medium capitalize">
                        user
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Change Password card ===== */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                      <FaLock className="text-2xl text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Change Password
                      </h3>
                      <p className="text-sm text-gray-500">
                        Update your account password
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={passwordForm.handleSubmit(onPwdValid, onInvalid)}
                    className="space-y-5"
                  >
                    <Controller
                      name="currentPassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Current Password
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={show.current ? "text" : "password"}
                              placeholder="Enter your current password"
                              className={pwdCls}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => toggleEye("current")}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {show.current ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="newPassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            New Password
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={show.next ? "text" : "password"}
                              placeholder="Enter your new password"
                              className={pwdCls}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => toggleEye("next")}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {show.next ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <p className="text-xs text-gray-500 mt-1">
                              Must be at least 8 characters with an uppercase, a
                              number and a symbol
                            </p>
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="confirmPassword"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Confirm New Password
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={show.confirm ? "text" : "password"}
                              placeholder="Confirm your new password"
                              className={pwdCls}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => toggleEye("confirm")}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {show.confirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={savingPwd}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-lg shadow-amber-600/25"
                      >
                        {savingPwd ? (
                          <ImSpinner10 className="animate-spin" />
                        ) : (
                          <FaLock />
                        )}
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
