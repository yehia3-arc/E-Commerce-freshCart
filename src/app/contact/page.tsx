"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/toast";
import PageHeader from "@/app/_components/PageHeader/PageHeader";
import {
  FaHeadset,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaClock,
  FaPaperPlane,
  FaCircleQuestion,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { myContactSchemas, ContactSchemaType } from "@/schemas/contact.schemas";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all";

const infoCards = [
  {
    icon: FaPhone,
    title: "Phone",
    desc: "Mon-Fri from 8am to 6pm",
    link: { href: "tel:+18001234567", label: "+1 (800) 123-4567" },
  },
  {
    icon: FaEnvelope,
    title: "Email",
    desc: "We'll respond within 24 hours",
    link: {
      href: "mailto:support@freshcart.com",
      label: "support@freshcart.com",
    },
  },
  {
    icon: FaLocationDot,
    title: "Office",
    lines: ["123 Commerce Street", "New York, NY 10001", "United States"],
  },
  {
    icon: FaClock,
    title: "Business Hours",
    lines: [
      "Monday - Friday: 8am - 6pm",
      "Saturday: 9am - 4pm",
      "Sunday: Closed",
    ],
  },
];

const socials = [
  { icon: FaFacebookF, href: "#" },
  { icon: FaTwitter, href: "#" },
  { icon: FaInstagram, href: "#" },
  { icon: FaLinkedinIn, href: "#" },
];

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Support" },
  { value: "shipping", label: "Shipping Question" },
  { value: "returns", label: "Returns & Refunds" },
  { value: "product", label: "Product Information" },
  { value: "feedback", label: "Feedback & Suggestions" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const form = useForm<ContactSchemaType>({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    resolver: zodResolver(myContactSchemas),
  });
  const { handleSubmit, control } = form;

  async function onValid(data: ContactSchemaType) {
    console.log("contact submitted:", data);
    // No contact API in Postman → simulate success like the demo
    toast.add({
      type: "success",
      description: "message sent successfully! We'll get back to you soon 😊",
    });
    form.reset();
  }
  const onInvalid = () =>
    toast.add({
      type: "error",
      description: "please fix the highlighted fields 😐",
    });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ===== Header (shared component, 3-stop green gradient) ===== */}
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with our team."
        icon={FaHeadset}
        gradient="from-green-600 via-green-500 to-green-400"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ===== LEFT: info cards ===== */}
          <div className="space-y-6 lg:col-span-1">
            {infoCards.map(({ icon: Icon, title, desc, lines, link }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                    <Icon className="text-lg text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">
                      {title}
                    </h3>
                    {desc && (
                      <p className="mb-2 text-sm text-gray-500">{desc}</p>
                    )}
                    {lines && (
                      <p className="text-sm text-gray-500">
                        {lines.map((l) => (
                          <span key={l}>
                            {l}
                            <br />
                          </span>
                        ))}
                      </p>
                    )}
                    {link && (
                      <a
                        href={link.href}
                        className="font-medium text-green-600 hover:underline"
                      >
                        {link.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Follow Us */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Follow Us</h3>
              <div className="flex items-center gap-3">
                {socials.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-green-600 hover:text-white"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ===== RIGHT: form + help box ===== */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                  <FaHeadset className="text-lg text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                  <p className="text-sm text-gray-500">
                    Fill out the form and we'll get back to you
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onValid, onInvalid)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className={inputCls}
                          {...field}
                        />
                        {fieldState.invalid && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldState.error?.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className={inputCls}
                          {...field}
                        />
                        {fieldState.invalid && (
                          <p className="mt-1 text-xs text-red-500">
                            {fieldState.error?.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Controller
                  name="subject"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        className={`${inputCls} bg-white`}
                        {...field}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      {fieldState.invalid && (
                        <p className="mt-1 text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="message"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="How can we help you?"
                        className={`${inputCls} resize-none`}
                        {...field}
                      />
                      {fieldState.invalid && (
                        <p className="mt-1 text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white shadow-sm shadow-green-600/20 transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
                >
                  <FaPaperPlane />
                  Send Message
                </button>
              </form>
            </div>

            {/* Help box */}
            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <FaCircleQuestion className="text-xl text-green-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">
                    Looking for quick answers?
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    Check out our Help Center for frequently asked questions
                    about orders, shipping, returns, and more.
                  </p>
                  <a
                    href="/help"
                    className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
                  >
                    Visit Help Center →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
