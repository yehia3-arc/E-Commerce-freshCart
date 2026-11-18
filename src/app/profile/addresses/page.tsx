"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PageHeader from "@/app/_components/PageHeader/PageHeader";
import { toast } from "@/components/ui/toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImSpinner10 } from "react-icons/im";
import {
  FaUser,
  FaLocationDot,
  FaGear,
  FaChevronRight,
  FaPlus,
  FaXmark,
  FaPhone,
  FaCity,
  FaPen,
  FaTrash,
} from "react-icons/fa6";
import {
  addAddress,
  getLoggedUserAddresses,
  removeAddress,
} from "@/actions/address.actions";
import { AddressType } from "@/api/types/user.type";

const emptyForm = { name: "", details: "", phone: "", city: "" };

export default function AddressesPage() {
  const { status } = useSession();
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AddressType | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchAddresses() {
    const res = await getLoggedUserAddresses();
    if (res.status === "success") setAddresses(res.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") fetchAddresses();
  }, [status]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(addr: AddressType) {
    setEditing(addr);
    setForm({
      name: addr.name,
      details: addr.details,
      phone: addr.phone,
      city: addr.city,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await removeAddress(editing._id);

      const res = await addAddress(form); // keys: name, details, phone, city
      if (res.status === "success") {
        toast.add({
          type: "success",
          description: editing
            ? "address updated successfully 🏠"
            : "address added successfully 🏠",
        });
        setOpen(false);
        await fetchAddresses();
      } else {
        toast.add({
          type: "error",
          description: res.message || "failed to save address 😥",
        });
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await removeAddress(id);
    if (res.status === "success") {
      toast.add({
        type: "success",
        description: "address removed successfully 🗑️",
      });
      await fetchAddresses();
    } else {
      toast.add({
        type: "error",
        description: res.message || "failed to remove address 😥",
      });
    }
    setDeletingId(null);
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ===== PageHeader (shared component, default green gradient) ===== */}
      <PageHeader
        title="My Account"
        subtitle="Manage your addresses and account settings"
        icon={FaUser}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ===== Sidebar nav ===== */}
          <aside className="w-full lg:w-72 shrink-0">
            <nav className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-4">
                <h2 className="font-bold text-gray-900">My Account</h2>
              </div>
              <ul className="p-2">
                <li>
                  <Link
                    href="/profile/addresses"
                    className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-green-700"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
                      <FaLocationDot className="text-sm" />
                    </span>
                    <span className="flex-1 font-medium">My Addresses</span>
                    <FaChevronRight className="text-xs text-green-500" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile/settings"
                    className="group flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-gray-200">
                      <FaGear className="text-sm" />
                    </span>
                    <span className="flex-1 font-medium">Settings</span>
                    <FaChevronRight className="text-xs text-gray-400" />
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* ===== Main ===== */}
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  My Addresses
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your saved delivery addresses
                </p>
              </div>
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700"
              >
                <FaPlus className="text-sm" /> Add Address
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center rounded-3xl border border-gray-100 bg-white p-12">
                <ImSpinner10 className="animate-spin text-green-600 text-3xl" />
              </div>
            ) : addresses.length === 0 ? (
              /* ===== Empty state (Figma #1) ===== */
              <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <FaLocationDot className="text-3xl text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  No Addresses Yet
                </h3>
                <p className="mx-auto mb-6 max-w-sm text-gray-500">
                  Add your first delivery address to make checkout faster and
                  easier.
                </p>
                <button
                  onClick={openAdd}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700"
                >
                  <FaPlus /> Add Your First Address
                </button>
              </div>
            ) : (
              /* ===== Address cards (Figma #3) ===== */
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-green-100 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-1 items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 transition-colors group-hover:bg-green-100">
                          <FaLocationDot className="text-lg text-green-600" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 font-bold text-gray-900">
                            {addr.name}
                          </h3>
                          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                            {addr.details}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <FaPhone className="text-xs" /> {addr.phone}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaCity className="text-xs" /> {addr.city}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(addr)}
                          title="Edit address"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-green-100 hover:text-green-600"
                        >
                          <FaPen className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(addr._id)}
                          disabled={deletingId === addr._id}
                          title="Delete address"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingId === addr._id ? (
                            <ImSpinner10 className="animate-spin text-sm" />
                          ) : (
                            <FaTrash className="text-sm" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ===== Add / Edit modal (Figma #2, shadcn Dialog) ===== */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditing(null);
            setForm(emptyForm);
          }
        }}
      >
        <DialogContent className="max-w-lg rounded-3xl sm:rounded-3xl p-6 sm:p-8 gap-0 border-0 shadow-2xl [&>button]:hidden">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editing ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            >
              <FaXmark />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Home, Office"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Address
              </label>
              <textarea
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Street, building, apartment..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01xxxxxxxxx"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Cairo"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Add Address"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
