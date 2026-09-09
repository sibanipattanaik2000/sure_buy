"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Edit3,
  Loader2,
  PackagePlus,
  Power,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";

import {
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProductStatus,
  type AdminProduct,
} from "./admin-product-api";

export default function AdminProductsPage() {
  const router = useRouter();

  const { user, loading: authLoading } =
    useAuth();

  const [products, setProducts] =
    useState<AdminProduct[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [actionId, setActionId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

const loadProducts =
  useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await getAdminProducts({
          page,
          limit: 10,
          search,
        });

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to load products",
        );
      }

      setProducts(
        response.data?.products ?? [],
      );

      setTotalPages(
        response.data?.pagination
          ?.totalPages ?? 1,
      );
    } catch (err) {
      console.error(
        "ADMIN PRODUCTS ERROR:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (
      !authLoading &&
      user?.role !== "ADMIN"
    ) {
      router.replace("/");
    }
  }, [
    authLoading,
    user,
    router,
  ]);

  useEffect(() => {
    if (
      !authLoading &&
      user?.role === "ADMIN"
    ) {
      void loadProducts();
    }
  }, [
    authLoading,
    user,
    loadProducts,
  ]);

  const handleStatus = async (
    product: AdminProduct,
  ) => {
    setActionId(product.id);
    setError("");
    setSuccess("");

    try {
      const response =
        await updateAdminProductStatus(
          String(product.id),
          !product.active,
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to update status",
        );
      }

      setProducts(
        current =>
          current.map(item =>
            item.id === product.id
              ? {
                  ...item,
                  active:
                    !item.active,
                }
              : item,
          ),
      );

      setSuccess(
        product.active
          ? `${product.name} was deactivated.`
          : `${product.name} was activated.`,
      );
    } catch (err) {
      console.error(
        "PRODUCT STATUS ERROR:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update status",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (
    product: AdminProduct,
  ) => {
    const confirmed =
      window.confirm(
        `Permanently delete "${product.name}"?\n\nThis cannot be undone. For production safety, products with customer/order history cannot be deleted.`,
      );

    if (!confirmed) {
      return;
    }

    setActionId(product.id);
    setError("");
    setSuccess("");

    try {
      await deleteAdminProduct(
        String(product.id),
      );

      setProducts(
        current =>
          current.filter(
            item =>
              item.id !== product.id,
          ),
      );

      setSuccess(
        `${product.name} was permanently deleted.`,
      );
    } catch (err: any) {
      console.error(
        "PRODUCT DELETE ERROR:",
        err,
      );

      if (
        err?.status === 409
      ) {
        setError(
          err.message ||
            "This product cannot be deleted because it is already referenced by customer/history records. Deactivate it instead.",
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete product",
        );
      }
    } finally {
      setActionId(null);
    }
  };

  if (
    authLoading ||
    user?.role !== "ADMIN"
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your catalogue,
              variants, stock and
              product visibility.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <PackagePlus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={event => {
                setPage(1);
                setSearch(
                  event.target.value,
                );
              }}
              placeholder="Search products..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              void loadProducts()
            }
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />
            Refresh
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <p className="font-semibold text-gray-900">
                No products found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try another search or add
                your first product.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Variants
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map(
                    product => (
                      <tr
                        key={
                          product.id
                        }
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {product.name}
                          </div>

                          <div className="mt-1 text-xs text-gray-500">
                            {product.brand} ·{" "}
                            {product.category}
                          </div>

                          <div className="mt-1 text-xs text-gray-400">
                            ID #{product.id}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            ₹
                            {Number(
                              product.price,
                            ).toLocaleString(
                              "en-IN",
                            )}
                          </div>

                          {product.originalPrice && (
                            <div className="text-xs text-gray-400 line-through">
                              ₹
                              {Number(
                                product.originalPrice,
                              ).toLocaleString(
                                "en-IN",
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {product.variants
                            ?.length ?? 0}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              product.active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {product.active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">

                            <Link
                               href={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </Link>

                            <button
                              type="button"
                              disabled={
                                actionId ===
                                product.id
                              }
                              onClick={() =>
                                void handleStatus(
                                  product,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              {actionId ===
                              product.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Power className="h-3.5 w-3.5" />
                              )}

                              {product.active
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                actionId ===
                                product.id
                              }
                              onClick={() =>
                                void handleDelete(
                                  product,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>

                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between">
            <button
              type="button"
              disabled={
                page <= 1 ||
                loading
              }
              onClick={() =>
                setPage(
                  current =>
                    Math.max(
                      1,
                      current - 1,
                    ),
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-gray-500">
              Page {page} of{" "}
              {totalPages}
            </span>

            <button
              type="button"
              disabled={
                page >=
                  totalPages ||
                loading
              }
              onClick={() =>
                setPage(
                  current =>
                    Math.min(
                      totalPages,
                      current + 1,
                    ),
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}