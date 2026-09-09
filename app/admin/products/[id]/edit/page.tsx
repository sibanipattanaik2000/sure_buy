"use client";

import {
ChangeEvent,
FormEvent,
useCallback,
useEffect,
useMemo,
useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";

/* =========================================================
TYPES
========================================================= */

type ProductCondition = "EXCELLENT" | "LIKE_NEW" | "GOOD";

type MediaType = "IMAGE" | "VIDEO";

type ProductMedia = {
id?: number;
variantId?: number | null;
variantIndex?: number | null;
url: string;
key?: string | null;
altText?: string | null;
type: MediaType;
mimeType?: string | null;
size?: number | null;
position?: number;
};

type ProductVariant = {
id?: number;
storage: string;
color: string;
colorHex: string;
price: string;
originalPrice: string;
stock: string;
highlights: string[];
};

type AdminProduct = {
id: number;
slug: string;
brand: string;
name: string;
category: string;
condition: ProductCondition;
price: number | string;
originalPrice: number | string;
warranty: string;
description: string;
emiFrom?: number | string | null;
active: boolean;

highlights?: Array<{
id?: number;
text: string;
position?: number;
}>;

variants: Array<{
id: number;
storage: string;
color: string;
colorHex?: string | null;
price: number | string;
originalPrice: number | string;
stock: number;
highlights?: Array<{
id?: number;
text: string;
position?: number;
}>;
}>;

images?: Array<{
id: number;
variantId?: number | null;
url: string;
key?: string | null;
altText?: string | null;
type: MediaType;
mimeType?: string | null;
size?: number | null;
position?: number;
}>;
};

type UploadResponse = {
uploadUrl: string;
url: string;
key: string;
};

/* =========================================================
CONSTANTS
========================================================= */

const CONDITIONS: ProductCondition[] = [
"EXCELLENT",
"LIKE_NEW",
"GOOD",
];

const CATEGORIES = [
"Smartphones",
"Tablets",
"Smartwatches",
"Laptops",
"Accessories",
];

/* =========================================================
HELPERS
========================================================= */

function toNumber(value: unknown): number {
const number = Number(value);
return Number.isFinite(number) ? number : 0;
}

function slugify(value: string): string {
return value
.trim()
.toLowerCase()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

function createEmptyVariant(): ProductVariant {
return {
storage: "",
color: "",
colorHex: "#000000",
price: "",
originalPrice: "",
stock: "10",
highlights: [""],
};
}

/* =========================================================
PAGE
========================================================= */

export default function EditProductPage() {
const params = useParams<{ id: string }>();
const router = useRouter();
const { user, loading: authLoading } = useAuth();

const productId = params?.id;

/* =======================================================
AUTH
======================================================= */

useEffect(() => {
if (!authLoading && user?.role !== "ADMIN") {
router.replace("/");
}
}, [authLoading, user, router]);

/* =======================================================
STATE
======================================================= */

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [uploading, setUploading] = useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [slug, setSlug] = useState("");
const [brand, setBrand] = useState("");
const [name, setName] = useState("");
const [category, setCategory] = useState("Smartphones");
const [condition, setCondition] =
useState<ProductCondition>("EXCELLENT");

const [price, setPrice] = useState("");
const [originalPrice, setOriginalPrice] = useState("");

const [warranty, setWarranty] = useState("");
const [description, setDescription] = useState("");
const [emiFrom, setEmiFrom] = useState("");

const [active, setActive] = useState(true);

const [highlights, setHighlights] = useState<string[]>([""]);

const [variants, setVariants] = useState<ProductVariant[]>([]);

const [media, setMedia] = useState<ProductMedia[]>([]);

/* =======================================================
LOAD PRODUCT
======================================================= */

const loadProduct = useCallback(async () => {
if (!productId) return;

try {
  setLoading(true);
  setError("");

  const response = await apiRequest<AdminProduct>(
    `/admin/products/${encodeURIComponent(productId)}`,
    {
      method: "GET",
    },
  );

  const product = response.data;

  if (!product) {
    throw new Error("Product data was not returned");
  }

  setSlug(product.slug ?? "");
  setBrand(product.brand ?? "");
  setName(product.name ?? "");
  setCategory(product.category ?? "Smartphones");
  setCondition(product.condition ?? "EXCELLENT");

  setPrice(String(product.price ?? ""));
  setOriginalPrice(String(product.originalPrice ?? ""));

  setWarranty(product.warranty ?? "");
  setDescription(product.description ?? "");

  setEmiFrom(
    product.emiFrom === null ||
    product.emiFrom === undefined
      ? ""
      : String(product.emiFrom),
  );

  setActive(Boolean(product.active));

  setHighlights(
    product.highlights?.length
      ? product.highlights.map((item) => item.text)
      : [""],
  );

  setVariants(
    product.variants?.length
      ? product.variants.map((variant) => ({
          id: variant.id,
          storage: variant.storage ?? "",
          color: variant.color ?? "",
          colorHex: variant.colorHex ?? "#000000",
          price: String(variant.price ?? ""),
          originalPrice: String(
            variant.originalPrice ?? "",
          ),
          stock: String(variant.stock ?? 0),
          highlights:
            variant.highlights?.length
              ? variant.highlights.map(
                  (item) => item.text,
                )
              : [""],
        }))
      : [createEmptyVariant()],
  );

const loadedMedia: ProductMedia[] =
  product.images?.map((image) => {
    let variantIndex: number | null = null;

    if (
      image.variantId !== null &&
      image.variantId !== undefined
    ) {
      const foundIndex =
        product.variants.findIndex(
          (variant) =>
            variant.id === image.variantId,
        );

      if (foundIndex >= 0) {
        variantIndex = foundIndex;
      }
    }

    return {
      id: image.id,
      variantId: image.variantId ?? null,
      variantIndex,
      url: image.url,
      key: image.key ?? null,
      altText: image.altText ?? null,
      type: image.type,
      mimeType: image.mimeType ?? null,
      size: image.size ?? null,
      position: image.position ?? 0,
    };
  }) ?? [];

  setMedia(loadedMedia);
} catch (err) {
  const message =
    err instanceof Error
      ? err.message
      : "Unable to load product";

  setError(message);
} finally {
  setLoading(false);
}

}, [productId]);

useEffect(() => {
if (!authLoading && user?.role === "ADMIN") {
loadProduct();
}
}, [authLoading, user, loadProduct]);

/* =======================================================
PRODUCT HIGHLIGHTS
======================================================= */

function updateHighlight(
index: number,
value: string,
) {
setHighlights((current) =>
current.map((item, itemIndex) =>
itemIndex === index ? value : item,
),
);
}

function addHighlight() {
setHighlights((current) => [...current, ""]);
}

function removeHighlight(index: number) {
setHighlights((current) => {
const next = current.filter(
(_, itemIndex) => itemIndex !== index,
);

  return next.length ? next : [""];
});

}

/* =======================================================
VARIANTS
======================================================= */

function updateVariant(
index: number,
field: keyof ProductVariant,
value: string | string[],
) {
setVariants((current) =>
current.map((variant, variantIndex) =>
variantIndex === index
? {
...variant,
[field]: value,
}
: variant,
),
);
}

function addVariant() {
setVariants((current) => [
...current,
createEmptyVariant(),
]);
}

function removeVariant(index: number) {
if (variants.length === 1) {
setError("At least one variant is required.");
return;
}

/*
 * Remove media attached to this variant and
 * shift indexes of later variants.
 */
setMedia((current) =>
  current
    .filter(
      (item) =>
        item.variantIndex !== index,
    )
    .map((item) => {
      if (
        item.variantIndex !== null &&
        item.variantIndex !== undefined &&
        item.variantIndex > index
      ) {
        return {
          ...item,
          variantIndex:
            item.variantIndex - 1,
        };
      }

      return item;
    }),
);

setVariants((current) =>
  current.filter(
    (_, variantIndex) =>
      variantIndex !== index,
  ),
);

}

function updateVariantHighlight(
variantIndex: number,
highlightIndex: number,
value: string,
) {
setVariants((current) =>
current.map((variant, index) => {
if (index !== variantIndex) {
return variant;
}


    return {
      ...variant,
      highlights: variant.highlights.map(
        (item, index) =>
          index === highlightIndex
            ? value
            : item,
      ),
    };
  }),
);
}

function addVariantHighlight(
variantIndex: number,
) {
setVariants((current) =>
current.map((variant, index) =>
index === variantIndex
? {
...variant,
highlights: [
...variant.highlights,
"",
],
}
: variant,
),
);
}

function removeVariantHighlight(
variantIndex: number,
highlightIndex: number,
) {
setVariants((current) =>
current.map((variant, index) => {
if (index !== variantIndex) {
return variant;
}

    const next =
      variant.highlights.filter(
        (_, index) =>
          index !== highlightIndex,
      );

    return {
      ...variant,
      highlights: next.length ? next : [""],
    };
  }),
);
}

/* =======================================================
MEDIA
======================================================= */

async function uploadFile(
event: ChangeEvent<HTMLInputElement>,
) {
const file = event.target.files?.[0];

if (!file) return;

try {
  setUploading(true);
  setError("");
  setSuccess("");

  const isVideo =
    file.type.startsWith("video/");

  const type: MediaType = isVideo
    ? "VIDEO"
    : "IMAGE";

  const maxSize = isVideo
    ? 100 * 1024 * 1024
    : 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      isVideo
        ? "Video must be 100MB or smaller."
        : "Image must be 10MB or smaller.",
    );
  }

  const uploadResponse =
    await apiRequest<UploadResponse>(
      "/admin/product-media/upload-url",
      {
        method: "POST",
        body: JSON.stringify({
          slug: slugify(slug || name),
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          type,
        }),
      },
    );

  const uploadData =
    uploadResponse.data;

  if (
    !uploadData?.uploadUrl ||
    !uploadData?.url ||
    !uploadData?.key
  ) {
    throw new Error(
      "Invalid upload URL response from server.",
    );
  }

  const uploadResult =
    await fetch(uploadData.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

  if (!uploadResult.ok) {
    throw new Error(
      "Failed to upload media to storage.",
    );
  }

  setMedia((current) => [
    ...current,
    {
      variantIndex: null,
      url: uploadData.url,
      key: uploadData.key,
      altText: `${brand} ${name}`,
      type,
      mimeType: file.type,
      size: file.size,
      position: current.length,
    },
  ]);

  setSuccess(
    `${type === "VIDEO" ? "Video" : "Image"} uploaded successfully.`,
  );
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Media upload failed.",
  );
} finally {
  setUploading(false);

  /*
   * Allow selecting the same file again.
   */
  event.target.value = "";
}
}

function updateMediaVariant(
mediaIndex: number,
value: string,
) {
setMedia((current) =>
current.map((item, index) =>
index === mediaIndex
? {
...item,
variantIndex:
value === ""
? null
: Number(value),
}
: item,
),
);
}

function removeMedia(index: number) {
setMedia((current) =>
current.filter(
(_, mediaIndex) =>
mediaIndex !== index,
),
);
}

/* =======================================================
VALIDATION
======================================================= */

const validationErrors = useMemo(() => {
const errors: string[] = [];
if (!brand.trim()) {
  errors.push("Brand is required.");
}

if (!name.trim()) {
  errors.push("Product name is required.");
}

if (!category.trim()) {
  errors.push("Category is required.");
}

if (!slugify(slug)) {
  errors.push("Valid product slug is required.");
}

if (!Number.isFinite(Number(price))) {
  errors.push("Valid product price is required.");
}

if (!Number.isFinite(Number(originalPrice))) {
  errors.push(
    "Valid original product price is required.",
  );
}

if (!warranty.trim()) {
  errors.push("Warranty is required.");
}

if (!description.trim()) {
  errors.push("Description is required.");
}

if (!variants.length) {
  errors.push(
    "At least one variant is required.",
  );
}

const variantKeys = new Set<string>();

variants.forEach((variant, index) => {
  if (!variant.storage.trim()) {
    errors.push(
      `Variant ${index + 1}: storage is required.`,
    );
  }

  if (!variant.color.trim()) {
    errors.push(
      `Variant ${index + 1}: color is required.`,
    );
  }

  const key =
    `${variant.storage.trim().toLowerCase()}::` +
    `${variant.color.trim().toLowerCase()}`;

  if (variantKeys.has(key)) {
    errors.push(
      `Duplicate variant: ${variant.storage} / ${variant.color}`,
    );
  }

  variantKeys.add(key);

  if (
    !Number.isFinite(
      Number(variant.price),
    )
  ) {
    errors.push(
      `Variant ${index + 1}: valid price is required.`,
    );
  }

  if (
    !Number.isFinite(
      Number(variant.originalPrice),
    )
  ) {
    errors.push(
      `Variant ${index + 1}: valid original price is required.`,
    );
  }

  const stock = Number(
    variant.stock,
  );

  if (
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    errors.push(
      `Variant ${index + 1}: stock must be a non-negative integer.`,
    );
  }
});

media.forEach((item) => {

  if (
    item.variantIndex !== null &&
    item.variantIndex !== undefined &&
    (item.variantIndex < 0 ||
      item.variantIndex >= variants.length)
  ) {
    errors.push(
      "One or more media files have an invalid variant.",
    );
  }
});

return errors;
}, [
brand,
name,
category,
slug,
price,
originalPrice,
warranty,
description,
variants,
media,
]);

/* =======================================================
SAVE
======================================================= */

async function handleSubmit(
event: FormEvent<HTMLFormElement>,
) {
event.preventDefault();

if (validationErrors.length > 0) {
  setError(validationErrors[0] ?? "Invalid form.");
  return;
}

if (!productId) {
  setError("Product ID is missing.");
  return;
}

try {
  setSaving(true);
  setError("");
  setSuccess("");

  const payload = {
    slug: slugify(slug),
    brand: brand.trim(),
    name: name.trim(),
    category: category.trim(),
    condition,

    price: Number(price),
    originalPrice: Number(originalPrice),

    warranty: warranty.trim(),
    description: description.trim(),

    emiFrom:
      emiFrom.trim() === ""
        ? null
        : Number(emiFrom),

    active,

    highlights: highlights
      .map((item) => item.trim())
      .filter(Boolean),

    variants: variants.map(
      (variant) => ({
        ...(variant.id
          ? { id: variant.id }
          : {}),

        storage:
          variant.storage.trim(),

        color:
          variant.color.trim(),

        colorHex:
          variant.colorHex.trim() ||
          null,

        price: Number(
          variant.price,
        ),

        originalPrice: Number(
          variant.originalPrice,
        ),

        stock: Number(
          variant.stock,
        ),

        highlights:
          variant.highlights
            .map((item) =>
              item.trim(),
            )
            .filter(Boolean),
      }),
    ),

    media: media.map(
      (item, index) => ({
        variantIndex:
          item.variantIndex ??
          null,

        url: item.url,

        key:
          item.key ??
          null,

        altText:
          item.altText ??
          null,

        type: item.type,

        mimeType:
          item.mimeType ??
          null,

        size:
          item.size ??
          null,

        position: index,
      }),
    ),
  };

  const response =
    await apiRequest<AdminProduct>(
      `/admin/products/${encodeURIComponent(productId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Failed to update product.",
    );
  }

  setSuccess(
    "Product updated successfully.",
  );

  /*
   * Go back to management page after
   * successful save.
   */
  setTimeout(() => {
    router.push("/admin/products");
  }, 700);
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Failed to update product.",
  );
} finally {
  setSaving(false);
}

}

/* =======================================================
LOADING / AUTH
======================================================= */

if (authLoading || loading) {
return ( <main className="min-h-screen p-6 bg-white p-5 text-gray-900 shadow-sm"> <div className="mx-auto max-w-6xl"> <div className="rounded-xl border p-8 text-center">
Loading product... </div> </div> </main>
);
}

if (user?.role !== "ADMIN") {
return null;
}

/* =======================================================
UI
======================================================= */

return ( <main className="min-h-screen p-4 md:p-6 bg-white"> <div className="mx-auto max-w-7xl">
{/* HEADER */}
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-5 text-gray-900 ">
      <div>

        <h1 className="text-2xl font-bold md:text-3xl bg-white p-5 text-gray-900 ">
          Edit Product
        </h1>

        <p className="mt-1 text-sm opacity-70">
          Update product information, variants
          and media.
        </p>
      </div>

      <div className="flex gap-2">
        <Link
          href="/admin/products"
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Cancel
        </Link>

        <button
          type="submit"
          form="edit-product-form"
          disabled={saving || uploading}
          className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>

    {/* MESSAGES */}

    {error && (
      <div className="mb-5 rounded-lg border p-4 text-sm bg-red-100 text-red-800">
        <strong>Error:</strong> {error}
      </div>
    )}

    {success && (
      <div className="mb-5 rounded-lg border p-4 text-sm">
        {success}
      </div>
    )}

    {/* FORM */}

    <form
      id="edit-product-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <section className="rounded-xl border p-5  bg-white p-5 text-gray-900 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold">
          Basic Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">
              Brand
            </span>

            <input
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Apple"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">
              Product Name
            </span>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2"
              placeholder="iPhone 17 Pro"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">
              Slug
            </span>

            <input
              value={slug}
              onChange={(e) =>
                setSlug(
                  slugify(
                    e.target.value,
                  ),
                )
              }
              className="w-full rounded-lg border px-3 py-2"
              placeholder="apple-iphone-17-pro"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">
              Category
            </span>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value,
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              {CATEGORIES.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">
              Condition
            </span>

            <select
              value={condition}
              onChange={(e) =>
                setCondition(
                  e.target.value as ProductCondition,
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              {CONDITIONS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">
              Warranty
            </span>

            <input
              value={warranty}
              onChange={(e) =>
                setWarranty(
                  e.target.value,
                )
              }
              className="w-full rounded-lg border px-3 py-2"
              placeholder="1 Year Apple Warranty"
            />
          </label>
        </div>
      </section>

      {/* =================================================
          PRICING
      ================================================= */}

<section className="rounded-xl border border-gray-200 bg-white p-5 text-gray-900 shadow-sm">        <h2 className="mb-5 text-lg font-semibold">
          Pricing
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium">
              Product Price
            </span>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value,
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">
              Original Price
            </span>

            <input
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) =>
                setOriginalPrice(
                  e.target.value,
                )
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">
              EMI From
            </span>

            <input
              type="number"
              min="0"
              value={emiFrom}
              onChange={(e) =>
                setEmiFrom(
                  e.target.value,
                )
              }
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Optional"
            />
          </label>
        </div>
      </section>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <section className="rounded-xl border p-5 bg-white p-5 text-gray-900">
        <h2 className="mb-5 text-lg font-semibold">
          Description
        </h2>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value,
            )
          }
          rows={6}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Product description..."
        />
      </section>

      {/* =================================================
          ACTIVE STATUS
      ================================================= */}

      <section className="rounded-xl border p-5">
        <div className="flex items-center justify-between gap-4 bg-white p-5 text-gray-900">
          <div>
            <h2 className="font-semibold">
              Product Status
            </h2>

            <p className="mt-1 text-sm opacity-70">
              Inactive products should not appear
              on the customer Buy page.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setActive(
                (current) => !current,
              )
            }
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            {active
              ? "ACTIVE"
              : "INACTIVE"}
          </button>
        </div>
      </section>

      {/* =================================================
          PRODUCT HIGHLIGHTS
      ================================================= */}

      <section className="rounded-xl border p-5 bg-white p-5 text-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Product Highlights
          </h2>

          <button
            type="button"
            onClick={addHighlight}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            + Add Highlight
          </button>
        </div>

        <div className="space-y-3">
          {highlights.map(
            (highlight, index) => (
              <div
                key={index}
                className="flex gap-2"
              >
                <input
                  value={highlight}
                  onChange={(e) =>
                    updateHighlight(
                      index,
                      e.target.value,
                    )
                  }
                  className="flex-1 rounded-lg border px-3 py-2"
                  placeholder="Example: 48MP camera"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeHighlight(
                      index,
                    )
                  }
                  className="rounded-lg border px-3 py-2"
                >
                  Remove
                </button>
              </div>
            ),
          )}
        </div>
      </section>

      {/* =================================================
          VARIANTS
      ================================================= */}

      <section className="rounded-xl border p-5 bg-white p-5 text-gray-900">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Variants
            </h2>

            <p className="mt-1 text-sm opacity-70">
              Storage + color combinations must
              be unique.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            + Add Variant
          </button>
        </div>

        <div className="space-y-6">
          {variants.map(
            (variant, variantIndex) => (
              <div
                key={
                  variant.id ??
                  `new-${variantIndex}`
                }
                className="rounded-xl border p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">
                    Variant{" "}
                    {variantIndex + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeVariant(
                        variantIndex,
                      )
                    }
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    Remove Variant
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-sm font-medium">
                      Storage
                    </span>

                    <input
                      value={
                        variant.storage
                      }
                      onChange={(e) =>
                        updateVariant(
                          variantIndex,
                          "storage",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                      placeholder="512GB"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium">
                      Color
                    </span>

                    <input
                      value={
                        variant.color
                      }
                      onChange={(e) =>
                        updateVariant(
                          variantIndex,
                          "color",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                      placeholder="Black"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium">
                      Color Hex
                    </span>

                    <input
                      type="text"
                      value={
                        variant.colorHex
                      }
                      onChange={(e) =>
                        updateVariant(
                          variantIndex,
                          "colorHex",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                      placeholder="#000000"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium">
                      Price
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={
                        variant.price
                      }
                      onChange={(e) =>
                        updateVariant(
                          variantIndex,
                          "price",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium">
                      Original Price
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={
                        variant.originalPrice
                      }
                      onChange={(e) =>
                        updateVariant(
                          variantIndex,
                          "originalPrice",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium">
                      Stock
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={
                        variant.stock
                      }
                      onChange={(e) =>
                        updateVariant(
                          variantIndex,
                          "stock",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </label>
                </div>

                {/* VARIANT HIGHLIGHTS */}

                <div className="mt-5  ">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">
                      Variant Highlights
                    </h4>

                    <button
                      type="button"
                      onClick={() =>
                        addVariantHighlight(
                          variantIndex,
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {variant.highlights.map(
                      (
                        highlight,
                        highlightIndex,
                      ) => (
                        <div
                          key={
                            highlightIndex
                          }
                          className="flex gap-2"
                        >
                          <input
                            value={
                              highlight
                            }
                            onChange={(
                              e,
                            ) =>
                              updateVariantHighlight(
                                variantIndex,
                                highlightIndex,
                                e.target
                                  .value,
                              )
                            }
                            className="flex-1 rounded-lg border px-3 py-2"
                            placeholder="Variant highlight"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeVariantHighlight(
                                variantIndex,
                                highlightIndex,
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* =================================================
          MEDIA
      ================================================= */}

      <section className="rounded-xl border p-5 bg-white p-5 text-gray-900">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Product Images & Videos
          </h2>

          <p className="mt-1 text-sm opacity-70">
            Existing media is retained unless you
            remove it. New files are uploaded to R2.
          </p>
        </div>

        {/* UPLOAD */}

        <div className="mb-6 rounded-xl border p-4 bg-white p-5 text-gray-900">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Add Image / Video
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
              onChange={uploadFile}
              disabled={uploading}
              className="block w-full text-sm"
            />
          </label>

          {uploading && (
            <p className="mt-3 text-sm">
              Uploading media...
            </p>
          )}
        </div>

        {/* MEDIA LIST */}

        {media.length === 0 ? (
          <div className="rounded-lg border p-5 text-center text-sm opacity-70">
            No product media.
          </div>
        ) : (
          <div className="space-y-4">
            {media.map(
              (item, index) => (
                <div
                  key={
                    item.id ??
                    `${item.url}-${index}`
                  }
                  className="rounded-xl border p-4"
                >
                  <div className="grid gap-4 md:grid-cols-[160px_1fr_auto] md:items-center">
                    {/* PREVIEW */}

                    <div className="overflow-hidden rounded-lg border">
                      {item.type ===
                      "VIDEO" ? (
                        <video
                          src={item.url}
                          controls
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={
                            item.altText ??
                            name
                          }
                          className="h-32 w-full object-cover"
                        />
                      )}
                    </div>

                    {/* INFO */}

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {item.type}
                        </p>

                        <p className="break-all text-xs opacity-60">
                          {item.key ??
                            item.url}
                        </p>
                      </div>

                      <label className="block">
                        <span className="mb-1 block text-sm">
                          Assign to variant
                        </span>

                        <select
                          value={
                            item.variantIndex ===
                              null ||
                            item.variantIndex ===
                              undefined
                              ? ""
                              : String(
                                  item.variantIndex,
                                )
                          }
                          onChange={(
                            e,
                          ) =>
                            updateMediaVariant(
                              index,
                              e.target
                                .value,
                            )
                          }
                          className="w-full rounded-lg border px-3 py-2"
                        >
                          <option value="">
                            Common Product Media
                          </option>

                          {variants.map(
                            (
                              variant,
                              variantIndex,
                            ) => (
                              <option
                                key={
                                  variant.id ??
                                  variantIndex
                                }
                                value={String(
                                  variantIndex,
                                )}
                              >
                                {
                                  variant.storage
                                }{" "}
                                -{" "}
                                {
                                  variant.color
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </label>
                    </div>

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeMedia(
                          index,
                        )
                      }
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      {/* =================================================
          VALIDATION SUMMARY
      ================================================= */}

      {validationErrors.length > 0 && (
        <section className="rounded-xl border p-5">
          <h2 className="mb-3 font-semibold">
            Please fix before saving
          </h2>

          <ul className="list-disc space-y-1 pl-5 text-sm">
            {validationErrors
              .slice(0, 10)
              .map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ),
              )}
          </ul>
        </section>
      )}

      {/* =================================================
          SAVE
      ================================================= */}

      <div className="flex flex-col gap-3  pt-6 sm:flex-row sm:justify-end bg-white p-5 text-gray-900">
        <Link
          href="/admin/products"
          className="rounded-lg border px-5 py-3 text-center text-sm font-semibold"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={
            saving ||
            uploading ||
            validationErrors.length >
              0
          }
          className="rounded-lg border px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  </div>
</main>

);
}
