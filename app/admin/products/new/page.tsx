"use client";

import {
useEffect,
useMemo,
useRef,
useState,
} from "react";
import { useRouter } from "next/navigation";
import {
ArrowLeft,
CheckCircle2,
ImagePlus,
Loader2,
Plus,
Trash2,
Upload,
Video,
X,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import {
createAdminProduct,
createProductMediaUploadUrl,
type AdminProductMediaPayload,
type AdminProductMediaType,
} from "@/app/lib/api";

type VariantForm = {
storage: string;
color: string;
colorHex: string;
price: string;
originalPrice: string;
stock: string;
highlights: string[];
};

type MediaForm = {
id: string;
file: File;
previewUrl: string;
uploadUrl?: string;
url?: string;
key?: string;
type?: AdminProductMediaType;
mimeType?: string;
size?: number;

/*

* IMPORTANT:
* This is only temporary frontend state.
* Backend converts this index into the real
* ProductVariant.id when creating the product.
*
* "" = common product media
  */
  variantIndex: string;

altText: string;
position: number;
status: "pending" | "uploading" | "uploaded" | "error";
error?: string;
};

const createEmptyVariant = (): VariantForm => ({
storage: "",
color: "",
colorHex: "#000000",
price: "",
originalPrice: "",
stock: "10",
highlights: [""],
});

const conditions = [
{
value: "EXCELLENT",
label: "Excellent",
},
{
value: "LIKE_NEW",
label: "Like New",
},
{
value: "GOOD",
label: "Good",
},
] as const;

const categories = [
"Smartphones",
"Tablets",
"Smartwatches",
"Laptops",
"Accessories",
];

function createId() {
return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function slugify(value: string) {
return value
.trim()
.toLowerCase()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

function Input({
label,
value,
onChange,
placeholder,
type = "text",
required = false,
min,
step,
}: {
label: string;
value: string;
onChange: (value: string) => void;
placeholder?: string;
type?: string;
required?: boolean;
min?: string;
step?: string;
}) {
return ( <label className="block"> <span className="mb-2 block text-sm font-semibold text-gray-700">
{label}
    {required && (
      <span className="ml-1 text-red-500">
        *
      </span>
    )}
  </span>

  <input
    type={type}
    value={value}
    onChange={(event) =>
      onChange(event.target.value)
    }
    placeholder={placeholder}
    required={required}
    min={min}
    step={step}
    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</label>

);
}

export default function NewAdminProductPage() {
const router = useRouter();
const { user, loading } = useAuth();

const imageInputRef =
useRef<HTMLInputElement>(null);

const videoInputRef =
useRef<HTMLInputElement>(null);

/*

* null = common product media
* number = media belongs to that variant index
  */
  const [pendingMediaVariant, setPendingMediaVariant] =
  useState<number | null>(null);

const [name, setName] = useState("");
const [slug, setSlug] = useState("");
const [slugEdited, setSlugEdited] =
useState(false);

const [brand, setBrand] = useState("");

const [category, setCategory] =
useState("Smartphones");

const [condition, setCondition] =
useState<
"EXCELLENT" | "LIKE_NEW" | "GOOD"
>("EXCELLENT");

const [price, setPrice] = useState("");

const [originalPrice, setOriginalPrice] =
useState("");

const [warranty, setWarranty] =
useState("1 Year Warranty");

const [description, setDescription] =
useState("");

const [emiFrom, setEmiFrom] =
useState("");

const [active, setActive] = useState(true);

/*

* Common product highlights.
* Variant highlights are stored separately.
  */
  const [highlights, setHighlights] =
  useState<string[]>([""]);

const [variants, setVariants] =
useState<VariantForm[]>([
createEmptyVariant(),
]);

const [media, setMedia] =
useState<MediaForm[]>([]);

const [submitting, setSubmitting] =
useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

useEffect(() => {
if (!slugEdited) {
setSlug(slugify(name));
}
}, [name, slugEdited]);

useEffect(() => {
if (
!loading &&
user?.role !== "ADMIN"
) {
router.replace("/");
}
}, [loading, user, router]);

/*

* Only media that successfully completed
* the R2 upload.
  */
  const uploadedMedia = useMemo(
  () =>
  media.filter(
  (item) =>
  item.status === "uploaded" &&
  item.url &&
  item.key &&
  item.type,
  ),
  [media],
  );

/*

* ---
* PRODUCT HIGHLIGHTS
* ---

*/

const updateHighlight = (
index: number,
value: string,
) => {
setHighlights((current) =>
current.map(
(highlight, highlightIndex) =>
highlightIndex === index
? value
: highlight,
),
);
};

const addHighlight = () => {
setHighlights((current) => [
...current,
"",
]);
};

const removeHighlight = (
index: number,
) => {
setHighlights((current) => {
const next = current.filter(
(_, highlightIndex) =>
highlightIndex !== index,
);

  return next.length > 0
    ? next
    : [""];
});

};

/*

* ---
* VARIANTS
* ---

*/

const updateVariant = (
index: number,
field: keyof VariantForm,
value: string,
) => {
setVariants((current) =>
current.map(
(variant, variantIndex) =>
variantIndex === index
? {
...variant,
[field]: value,
}
: variant,
),
);
};

const addVariant = () => {
setVariants((current) => [
...current,
createEmptyVariant(),
]);
};

const removeVariant = (
index: number,
) => {
if (variants.length === 1) {
return;
}

/*
 * Remove media belonging to the deleted
 * variant instead of accidentally attaching
 * it to another variant.
 *
 * Common media is preserved.
 */
setMedia((current) => {
  const removed = current.filter(
    (item) =>
      item.variantIndex ===
      String(index),
  );

  removed.forEach((item) => {
    URL.revokeObjectURL(
      item.previewUrl,
    );
  });

  return current
    .filter(
      (item) =>
        item.variantIndex !==
        String(index),
    )
    .map((item) => {
      if (
        item.variantIndex === ""
      ) {
        return item;
      }

      const oldIndex = Number(
        item.variantIndex,
      );

      if (
        Number.isNaN(oldIndex)
      ) {
        return item;
      }

      if (oldIndex > index) {
        return {
          ...item,
          variantIndex: String(
            oldIndex - 1,
          ),
        };
      }

      return item;
    });
});

setVariants((current) =>
  current.filter(
    (_, variantIndex) =>
      variantIndex !== index,
  ),
);

};

/*

* ---
* VARIANT HIGHLIGHTS
* ---

*/

const updateVariantHighlight = (
variantIndex: number,
highlightIndex: number,
value: string,
) => {
setVariants((current) =>
current.map(
(variant, index) =>
index === variantIndex
? {
...variant,
highlights:
variant.highlights.map(
(
highlight,
currentHighlightIndex,
) =>
currentHighlightIndex ===
highlightIndex
? value
: highlight,
),
}
: variant,
),
);
};

const addVariantHighlight = (
variantIndex: number,
) => {
setVariants((current) =>
current.map(
(variant, index) =>
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
};

const removeVariantHighlight = (
variantIndex: number,
highlightIndex: number,
) => {
setVariants((current) =>
current.map((variant, index) => {
if (index !== variantIndex) {
return variant;
}

    const next =
      variant.highlights.filter(
        (_, currentHighlightIndex) =>
          currentHighlightIndex !==
          highlightIndex,
      );

    return {
      ...variant,
      highlights:
        next.length > 0
          ? next
          : [""],
    };
  }),
);

};

/*

* ---
* MEDIA
* ---

*/

const addFiles = (
files: FileList | null,
expectedType: AdminProductMediaType,
variantIndex: number | null = null,
) => {
if (!files) {
return;
}
const selectedFiles =
  Array.from(files).filter((file) => {
    if (
      expectedType === "IMAGE"
    ) {
      return file.type.startsWith(
        "image/",
      );
    }

    return file.type.startsWith(
      "video/",
    );
  });

if (selectedFiles.length === 0) {
  return;
}

const newItems: MediaForm[] =
  selectedFiles.map(
    (file, index) => ({
      id: createId(),

      file,

      previewUrl:
        URL.createObjectURL(file),

      /*
       * THIS IS THE IMPORTANT PART.
       *
       * Blue variant gets "0".
       * Orange variant gets "1".
       * Common media gets "".
       */
      variantIndex:
        variantIndex === null
          ? ""
          : String(variantIndex),

      altText:
        name.trim() ||
        file.name.replace(
          /\.[^/.]+$/,
          "",
        ),

      position:
        media.length + index,

      status: "pending",
    }),
  );

setMedia((current) => [
  ...current,
  ...newItems,
]);

};

const openVariantImagePicker = (
variantIndex: number,
) => {
setPendingMediaVariant(
variantIndex,
);

setTimeout(() => {
  imageInputRef.current?.click();
}, 0);

};

const openVariantVideoPicker = (
variantIndex: number,
) => {
setPendingMediaVariant(
variantIndex,
);

setTimeout(() => {
  videoInputRef.current?.click();
}, 0);

};

const removeMedia = (
id: string,
) => {
setMedia((current) => {
const item = current.find(
(mediaItem) =>
mediaItem.id === id,
);

  if (item) {
    URL.revokeObjectURL(
      item.previewUrl,
    );
  }

  return current.filter(
    (mediaItem) =>
      mediaItem.id !== id,
  );
});

};

const updateMedia = (
id: string,
changes: Partial<MediaForm>,
) => {
setMedia((current) =>
current.map((item) =>
item.id === id
? {
...item,
...changes,
}
: item,
),
);
};

const uploadMedia = async (
item: MediaForm,
) => {
updateMedia(item.id, {
status: "uploading",
error: undefined,
});

try {
  const response =
    await createProductMediaUploadUrl(
      {
        slug,
        fileName: item.file.name,
        contentType:
          item.file.type,
        size: item.file.size,
      },
    );

  if (
    !response.success ||
    !response.data
  ) {
    throw new Error(
      response.message ||
        "Unable to create upload URL",
    );
  }

  const upload =
    response.data;

  const uploadResponse =
    await fetch(
      upload.uploadUrl,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            item.file.type,
        },
        body: item.file,
      },
    );

  if (!uploadResponse.ok) {
    throw new Error(
      `R2 upload failed (${uploadResponse.status})`,
    );
  }

  updateMedia(item.id, {
    uploadUrl:
      upload.uploadUrl,

    url: upload.url,

    key: upload.key,

    type: upload.type,

    mimeType:
      upload.mimeType,

    size: upload.size,

    status: "uploaded",
  });
} catch (uploadError) {
  console.error(
    "PRODUCT MEDIA UPLOAD ERROR:",
    uploadError,
  );

  updateMedia(item.id, {
    status: "error",

    error:
      uploadError instanceof Error
        ? uploadError.message
        : "Upload failed",
  });
}
};

const uploadAllMedia = async () => {
const pending =
media.filter(
(item) =>
item.status ===
"pending" ||
item.status ===
"error",
);

for (const item of pending) {
  await uploadMedia(item);
}

};

/*

* ---
* MEDIA HELPERS
* ---

*/

const getVariantMedia = (
variantIndex: number,
) => {
return media.filter(
(item) =>
item.variantIndex ===
String(variantIndex),
);
};

const getCommonMedia = () => {
return media.filter(
(item) =>
item.variantIndex === "",
);
};

/*

* ---
* VALIDATION
* ---

*/

const validateForm = () => {
if (!name.trim()) {
return "Product name is required.";
}

if (!brand.trim()) {
  return "Brand is required.";
}

if (!slug.trim()) {
  return "Product slug is required.";
}

const productPrice =
  Number(price);

const productOriginalPrice =
  Number(originalPrice);

if (
  !Number.isFinite(
    productPrice,
  ) ||
  productPrice < 0
) {
  return "Enter a valid product price.";
}

if (
  !Number.isFinite(
    productOriginalPrice,
  ) ||
  productOriginalPrice < 0
) {
  return "Enter a valid original price.";
}

if (!warranty.trim()) {
  return "Warranty is required.";
}

if (!description.trim()) {
  return "Description is required.";
}

if (variants.length === 0) {
  return "At least one variant is required.";
}

for (
  let index = 0;
  index < variants.length;
  index++
) {
  const variant =
    variants[index];

  if (!variant) {
    return `Variant ${index + 1} is invalid.`;
  }

  if (!variant.storage.trim()) {
    return `Storage is required for variant ${
      index + 1
    }.`;
  }

  if (!variant.color.trim()) {
    return `Color is required for variant ${
      index + 1
    }.`;
  }

  const variantPrice =
    Number(variant.price);

  const variantOriginalPrice =
    Number(
      variant.originalPrice,
    );

  const stock =
    Number(variant.stock);

  if (
    !Number.isFinite(
      variantPrice,
    ) ||
    variantPrice < 0
  ) {
    return `Invalid price for variant ${
      index + 1
    }.`;
  }

  if (
    !Number.isFinite(
      variantOriginalPrice,
    ) ||
    variantOriginalPrice < 0
  ) {
    return `Invalid original price for variant ${
      index + 1
    }.`;
  }

  if (
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    return `Invalid stock for variant ${
      index + 1
    }.`;
  }
}

/*
 * Prevent duplicate storage/color
 * combinations.
 */
const duplicateKeys =
  new Set<string>();

for (const variant of variants) {
  const key =
    `${variant.storage.trim()}::${variant.color.trim()}`
      .toLowerCase();

  if (duplicateKeys.has(key)) {
    return `Duplicate variant: ${variant.storage} / ${variant.color}`;
  }

  duplicateKeys.add(key);
}

/*
 * Every selected media must either
 * successfully upload or be removed.
 */
const failedMedia =
  media.filter(
    (item) =>
      item.status === "error",
  );

if (failedMedia.length > 0) {
  return "Some media uploads failed. Please retry them.";
}

const unfinishedMedia =
  media.filter(
    (item) =>
      item.status !==
      "uploaded",
  );

if (unfinishedMedia.length > 0) {
  return "Please upload all selected media before creating the product.";
}

/*
 * Ensure every variant-specific media
 * points to an existing variant.
 */
for (const item of media) {
  if (
    item.variantIndex === ""
  ) {
    continue;
  }

  const index = Number(
    item.variantIndex,
  );

  if (
    !Number.isInteger(index) ||
    !variants[index]
  ) {
    return "Some media is assigned to an invalid variant. Please remove and re-add it.";
  }
}

return null;

};

/*

* ---
* SUBMIT
* ---

*/

const handleSubmit = async () => {
setError("");
setSuccess("");
const validation =
  validateForm();

if (validation) {
  setError(validation);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  return;
}

setSubmitting(true);

try {
  const cleanHighlights =
    highlights
      .map((item) =>
        item.trim(),
      )
      .filter(Boolean);

  /*
   * IMPORTANT:
   *
   * variantIndex is ONLY used to tell
   * the backend which variant this media
   * belongs to.
   *
   * Backend converts:
   *
   * 0 -> actual Blue variant ID
   * 1 -> actual Orange variant ID
   *
   * It is NOT stored as variantIndex.
   */
  const productMedia: AdminProductMediaPayload[] =
    uploadedMedia.map(
      (item, index) => ({
        variantIndex:
          item.variantIndex ===
          ""
            ? null
            : Number(
                item.variantIndex,
              ),

        url: item.url!,

        key: item.key!,

        altText:
          item.altText.trim() ||
          null,

        type: item.type!,

        mimeType:
          item.mimeType ||
          item.file.type,

        size:
          item.size ??
          item.file.size,

        position: index,
      }),
    );

  const payload = {
    slug: slugify(slug),

    brand:
      brand.trim(),

    name:
      name.trim(),

    category:
      category.trim(),

    condition,

    price:
      Number(price),

    originalPrice:
      Number(
        originalPrice,
      ),

    warranty:
      warranty.trim(),

    description:
      description.trim(),

    emiFrom:
      emiFrom.trim()
        ? Number(emiFrom)
        : null,

    active,

    /*
     * Common/fallback highlights.
     */
    highlights:
      cleanHighlights,

    /*
     * Each variant owns its own:
     *
     * storage
     * color
     * colorHex
     * price
     * originalPrice
     * stock
     * highlights
     */
    variants:
      variants.map(
        (variant) => ({
          storage:
            variant.storage.trim(),

          color:
            variant.color.trim(),

          colorHex:
            variant.colorHex.trim() ||
            null,

          price:
            Number(
              variant.price,
            ),

          originalPrice:
            Number(
              variant.originalPrice,
            ),

          stock:
            Number(
              variant.stock,
            ),

          highlights:
            variant.highlights
              .map(
                (item) =>
                  item.trim(),
              )
              .filter(Boolean),
        }),
      ),

    /*
     * Variant-specific media
     * is connected by variantIndex.
     */
    media:
      productMedia,
  };

  const response =
    await createAdminProduct(
      payload,
    );

  if (!response.success) {
    throw new Error(
      response.message ||
        "Unable to create product.",
    );
  }

  setSuccess(
    "Product created successfully.",
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  setTimeout(() => {
    router.push("/buy");
  }, 1200);
} catch (submitError) {
  console.error(
    "CREATE PRODUCT ERROR:",
    submitError,
  );

  setError(
    submitError instanceof Error
      ? submitError.message
      : "Unable to create product.",
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
} finally {
  setSubmitting(false);
}
};

/*

* ---
* LOADING / ACCESS
* ---

*/

if (loading) {
return ( <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa]"> <Loader2
       className="animate-spin text-indigo-600"
       size={32}
     /> </main>
);
}

if (user?.role !== "ADMIN") {
return null;
}

const commonMedia =
getCommonMedia();

/*

* ---
* UI
* ---

*/

return ( <main className="min-h-screen bg-[#f7f8fa] text-gray-900"> <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
    {/* HEADER */}
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <button
          type="button"
          onClick={() =>
            router.push("/buy")
          }
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to products
        </button>

        <h1 className="text-3xl font-black tracking-tight">
          Add Product
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add a product directly to
          the production catalog.
        </p>
      </div>
    </div>

    {/* ALERTS */}
    {error && (
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <X
          size={18}
          className="mt-0.5 shrink-0"
        />

        <span>{error}</span>
      </div>
    )}

    {success && (
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0"
        />

        <span>{success}</span>
      </div>
    )}

    <div className="space-y-6">

      {/* BASIC INFORMATION */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-black">
            Basic information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Main information displayed on
            the product details page.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Product name"
            value={name}
            onChange={setName}
            placeholder="Apple iPhone 17 Pro"
            required
          />

          <Input
            label="Brand"
            value={brand}
            onChange={setBrand}
            placeholder="Apple"
            required
          />

          <Input
            label="Product slug"
            value={slug}
            onChange={(value) => {
              setSlugEdited(true);
              setSlug(
                slugify(value),
              );
            }}
            placeholder="apple-iphone-17-pro"
            required
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Category
              <span className="ml-1 text-red-500">
                *
              </span>
            </span>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {categories.map(
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

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Condition
              <span className="ml-1 text-red-500">
                *
              </span>
            </span>

            <select
              value={condition}
              onChange={(event) =>
                setCondition(
                  event.target
                    .value as typeof condition,
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {conditions.map(
                (item) => (
                  <option
                    key={item.value}
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                ),
              )}
            </select>
          </label>

          <Input
            label="Starting price"
            value={price}
            onChange={setPrice}
            placeholder="99900"
            type="number"
            min="0"
            step="0.01"
            required
          />

          <Input
            label="Starting original price"
            value={originalPrice}
            onChange={
              setOriginalPrice
            }
            placeholder="119900"
            type="number"
            min="0"
            step="0.01"
            required
          />

          <Input
            label="Warranty"
            value={warranty}
            onChange={setWarranty}
            placeholder="1 Year Apple Warranty"
            required
          />

          <Input
            label="EMI from"
            value={emiFrom}
            onChange={setEmiFrom}
            placeholder="2999"
            type="number"
            min="0"
            step="0.01"
          />
        </div>

        <div className="mt-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              Description
              <span className="ml-1 text-red-500">
                *
              </span>
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              rows={5}
              placeholder="Describe the product, condition, warranty and important details..."
              className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) =>
              setActive(
                event.target.checked,
              )
            }
            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
          />

          <span className="text-sm font-semibold">
            Publish product immediately
          </span>
        </label>
      </section>

      {/* VARIANTS */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black">
              Product variants
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Each storage/color combination
              is one variant of this single
              product.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
          >
            <Plus size={16} />
            Add variant
          </button>
        </div>

        <div className="space-y-5">

          {variants.map(
            (variant, index) => {
              const variantMedia =
                getVariantMedia(
                  index,
                );

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >

                  {/* VARIANT HEADER */}
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">
                        Variant{" "}
                        {index + 1}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {variant.storage ||
                          "Storage"}{" "}
                        /{" "}
                        {variant.color ||
                          "Color"}
                      </p>
                    </div>

                    {variants.length >
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeVariant(
                            index,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-500 shadow-sm transition hover:bg-red-50"
                        aria-label="Remove variant"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    )}
                  </div>

                  {/* VARIANT DATA */}
                  <div className="grid gap-4 md:grid-cols-3">

                    <Input
                      label="Storage"
                      value={
                        variant.storage
                      }
                      onChange={(value) =>
                        updateVariant(
                          index,
                          "storage",
                          value,
                        )
                      }
                      placeholder="256GB"
                      required
                    />

                    <Input
                      label="Color"
                      value={
                        variant.color
                      }
                      onChange={(value) =>
                        updateVariant(
                          index,
                          "color",
                          value,
                        )
                      }
                      placeholder="Deep Blue"
                      required
                    />

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-gray-700">
                        Color code
                      </span>

                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={
                            variant.colorHex ||
                            "#000000"
                          }
                          onChange={(
                            event,
                          ) =>
                            updateVariant(
                              index,
                              "colorHex",
                              event
                                .target
                                .value,
                            )
                          }
                          className="h-11 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
                        />

                        <input
                          value={
                            variant.colorHex
                          }
                          onChange={(
                            event,
                          ) =>
                            updateVariant(
                              index,
                              "colorHex",
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="#000000"
                          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>
                    </label>

                    <Input
                      label="Price"
                      value={
                        variant.price
                      }
                      onChange={(value) =>
                        updateVariant(
                          index,
                          "price",
                          value,
                        )
                      }
                      placeholder="109900"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                    />

                    <Input
                      label="Original price"
                      value={
                        variant.originalPrice
                      }
                      onChange={(value) =>
                        updateVariant(
                          index,
                          "originalPrice",
                          value,
                        )
                      }
                      placeholder="129900"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                    />

                    <Input
                      label="Stock"
                      value={
                        variant.stock
                      }
                      onChange={(value) =>
                        updateVariant(
                          index,
                          "stock",
                          value,
                        )
                      }
                      placeholder="10"
                      type="number"
                      min="0"
                      step="1"
                      required
                    />
                  </div>

                  {/* VARIANT HIGHLIGHTS */}
                  <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-sm font-black">
                          Variant highlights
                        </h4>

                        <p className="mt-1 text-xs text-gray-500">
                          These highlights are
                          shown when this variant
                          is selected.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addVariantHighlight(
                            index,
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold transition hover:border-indigo-300 hover:text-indigo-600"
                      >
                        <Plus
                          size={14}
                        />
                        Add highlight
                      </button>
                    </div>

                    <div className="space-y-3">
                      {variant.highlights.map(
                        (
                          highlight,
                          highlightIndex,
                        ) => (
                          <div
                            key={
                              highlightIndex
                            }
                            className="flex gap-3"
                          >
                            <input
                              value={
                                highlight
                              }
                              onChange={(
                                event,
                              ) =>
                                updateVariantHighlight(
                                  index,
                                  highlightIndex,
                                  event
                                    .target
                                    .value,
                                )
                              }
                              placeholder={`Variant ${index + 1} highlight ${highlightIndex + 1}`}
                              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeVariantHighlight(
                                  index,
                                  highlightIndex,
                                )
                              }
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-red-500 transition hover:bg-red-50"
                              aria-label="Remove variant highlight"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* VARIANT MEDIA */}
                  <div className="mt-6 rounded-2xl border border-indigo-100 bg-white p-4">

                    <div className="mb-4">
                      <h4 className="text-sm font-black">
                        Variant media
                      </h4>

                      <p className="mt-1 text-xs text-gray-500">
                        These images and videos
                        belong only to{" "}
                        <strong>
                          {variant.storage ||
                            `Variant ${index + 1}`}
                          {" / "}
                          {variant.color ||
                            "this color"}
                        </strong>
                        .
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">

                      <button
                        type="button"
                        onClick={() =>
                          openVariantImagePicker(
                            index,
                          )
                        }
                        className="flex min-h-24 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
                      >
                        <ImagePlus
                          size={24}
                          className="text-indigo-600"
                        />

                        <span className="mt-2 text-xs font-bold">
                          Add variant images
                        </span>

                        <span className="mt-1 text-[11px] text-gray-500">
                          Only for this variant
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openVariantVideoPicker(
                            index,
                          )
                        }
                        className="flex min-h-24 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
                      >
                        <Video
                          size={24}
                          className="text-indigo-600"
                        />

                        <span className="mt-2 text-xs font-bold">
                          Add variant videos
                        </span>

                        <span className="mt-1 text-[11px] text-gray-500">
                          Only for this variant
                        </span>
                      </button>

                    </div>

                    {variantMedia.length >
                      0 && (
                      <div className="mt-4 space-y-3">

                        {variantMedia.map(
                          (item) => (
                            <div
                              key={
                                item.id
                              }
                              className="rounded-xl border border-gray-200 p-3"
                            >

                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                  {item.file.type.startsWith(
                                    "image/",
                                  ) ? (
                                    <img
                                      src={
                                        item.previewUrl
                                      }
                                      alt={
                                        item.altText
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <video
                                      src={
                                        item.previewUrl
                                      }
                                      className="h-full w-full object-cover"
                                      muted
                                    />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">

                                  <p className="truncate text-xs font-bold">
                                    {
                                      item
                                        .file
                                        .name
                                    }
                                  </p>

                                  <p className="mt-1 text-[11px] text-gray-500">
                                    {(
                                      item.file
                                        .size /
                                      (1024 *
                                        1024)
                                    ).toFixed(
                                      2,
                                    )}{" "}
                                    MB
                                  </p>

                                  {item.status ===
                                    "error" && (
                                    <p className="mt-1 text-[11px] font-semibold text-red-600">
                                      {item.error ||
                                        "Upload failed"}
                                    </p>
                                  )}

                                  {item.status ===
                                    "uploaded" && (
                                    <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-green-600">
                                      <CheckCircle2
                                        size={
                                          12
                                        }
                                      />
                                      Uploaded to R2
                                    </p>
                                  )}
                                </div>

                                <div className="flex shrink-0 items-center gap-2">

                                  {item.status !==
                                    "uploaded" && (
                                    <button
                                      type="button"
                                      disabled={
                                        item.status ===
                                        "uploading"
                                      }
                                      onClick={() =>
                                        uploadMedia(
                                          item,
                                        )
                                      }
                                      className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {item.status ===
                                      "uploading" ? (
                                        <Loader2
                                          size={
                                            13
                                          }
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Upload
                                          size={
                                            13
                                          }
                                        />
                                      )}

                                      {item.status ===
                                      "uploading"
                                        ? "Uploading..."
                                        : "Upload"}
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeMedia(
                                        item.id,
                                      )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-red-500 transition hover:bg-red-50"
                                    aria-label="Remove media"
                                  >
                                    <Trash2
                                      size={
                                        14
                                      }
                                    />
                                  </button>

                                </div>
                              </div>

                              <div className="mt-3">
                                <label>
                                  <span className="mb-1 block text-[11px] font-semibold text-gray-500">
                                    Alt text
                                  </span>

                                  <input
                                    value={
                                      item.altText
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      updateMedia(
                                        item.id,
                                        {
                                          altText:
                                            event
                                              .target
                                              .value,
                                        },
                                      )
                                    }
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-500"
                                  />
                                </label>
                              </div>

                            </div>
                          ),
                        )}

                      </div>
                    )}

                  </div>

                </div>
              );
            },
          )}
        </div>
      </section>

      {/* COMMON HIGHLIGHTS */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-black">
              Common highlights
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Optional product-level highlights.
              Variant-specific highlights take
              priority.
            </p>
          </div>

          <button
            type="button"
            onClick={addHighlight}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold transition hover:border-indigo-300 hover:text-indigo-600"
          >
            <Plus size={16} />
            Add highlight
          </button>

        </div>

        <div className="space-y-3">

          {highlights.map(
            (
              highlight,
              index,
            ) => (
              <div
                key={index}
                className="flex gap-3"
              >

                <input
                  value={highlight}
                  onChange={(event) =>
                    updateHighlight(
                      index,
                      event.target.value,
                    )
                  }
                  placeholder={`Common highlight ${index + 1}`}
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeHighlight(
                      index,
                    )
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            ),
          )}

        </div>
      </section>

      {/* COMMON PRODUCT MEDIA */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-lg font-black">
            Common product media
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Optional media shared across all
            variants. For Blue/Orange-specific
            images, use the uploader inside the
            corresponding variant.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <button
            type="button"
            onClick={() => {
              setPendingMediaVariant(
                null,
              );

              imageInputRef.current?.click();
            }}
            className="flex min-h-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            <ImagePlus
              size={28}
              className="text-indigo-600"
            />

            <span className="mt-3 text-sm font-bold">
              Add common images
            </span>

            <span className="mt-1 text-xs text-gray-500">
              Shared across variants
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPendingMediaVariant(
                null,
              );

              videoInputRef.current?.click();
            }}
            className="flex min-h-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            <Video
              size={28}
              className="text-indigo-600"
            />

            <span className="mt-3 text-sm font-bold">
              Add common videos
            </span>

            <span className="mt-1 text-xs text-gray-500">
              Shared across variants
            </span>
          </button>

        </div>

        {/* HIDDEN IMAGE INPUT */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          hidden
          onChange={(event) => {
            addFiles(
              event.target.files,
              "IMAGE",
              pendingMediaVariant,
            );

            event.target.value = "";

            setPendingMediaVariant(
              null,
            );
          }}
        />

        {/* HIDDEN VIDEO INPUT */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          multiple
          hidden
          onChange={(event) => {
            addFiles(
              event.target.files,
              "VIDEO",
              pendingMediaVariant,
            );

            event.target.value = "";

            setPendingMediaVariant(
              null,
            );
          }}
        />

        {/* COMMON MEDIA LIST */}
        {commonMedia.length >
          0 && (
          <div className="mt-6 space-y-4">

            {commonMedia.map(
              (item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 p-4"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                      {item.file.type.startsWith(
                        "image/",
                      ) ? (
                        <img
                          src={
                            item.previewUrl
                          }
                          alt={
                            item.altText
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <video
                          src={
                            item.previewUrl
                          }
                          className="h-full w-full object-cover"
                          muted
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-bold">
                        {
                          item
                            .file
                            .name
                        }
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {(
                          item.file
                            .size /
                          (1024 *
                            1024)
                        ).toFixed(
                          2,
                        )}{" "}
                        MB
                      </p>

                      <div className="mt-3">
                        <label>
                          <span className="mb-1 block text-[11px] font-semibold text-gray-500">
                            Alt text
                          </span>

                          <input
                            value={
                              item.altText
                            }
                            onChange={(
                              event,
                            ) =>
                              updateMedia(
                                item.id,
                                {
                                  altText:
                                    event
                                      .target
                                      .value,
                                },
                              )
                            }
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-500"
                          />
                        </label>
                      </div>

                      {item.status ===
                        "error" && (
                        <p className="mt-2 text-xs font-semibold text-red-600">
                          {item.error ||
                            "Upload failed"}
                        </p>
                      )}

                      {item.status ===
                        "uploaded" && (
                        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle2
                            size={
                              13
                            }
                          />
                          Uploaded to R2
                        </p>
                      )}

                    </div>

                    <div className="flex shrink-0 items-center gap-2">

                      {item.status !==
                        "uploaded" && (
                        <button
                          type="button"
                          disabled={
                            item.status ===
                            "uploading"
                          }
                          onClick={() =>
                            uploadMedia(
                              item,
                            )
                          }
                          className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {item.status ===
                          "uploading" ? (
                            <Loader2
                              size={
                                14
                              }
                              className="animate-spin"
                            />
                          ) : (
                            <Upload
                              size={
                                14
                              }
                            />
                          )}

                          {item.status ===
                          "uploading"
                            ? "Uploading..."
                            : "Upload"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeMedia(
                            item.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2
                          size={15}
                        />
                      </button>

                    </div>

                  </div>
                </div>
              ),
            )}

          </div>
        )}

        {/* UPLOAD ALL */}
        {media.some(
          (item) =>
            item.status ===
              "pending" ||
            item.status ===
              "error",
        ) && (
          <button
            type="button"
            disabled={submitting}
            onClick={uploadAllMedia}
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
          >
            <Upload size={16} />
            Upload all pending media
          </button>
        )}

      </section>

      {/* SUBMIT */}
      <section className="sticky bottom-4 z-20 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-bold">
              Ready to publish?
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Each storage/color combination
              will be stored as a variant of
              this single product.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex min-w-48 items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-black text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2
                  size={17}
                />
                Create Product
              </>
            )}
          </button>

        </div>
      </section>

    </div>
  </div>
</main>
);
}
