"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Battery,
  Check,
  CircleHelp,
  Cpu,
  Image as ImageIcon,
  Loader2,
  MapPin,
  ShieldCheck,
  Smartphone,
  Truck,
  Upload,
  X,
} from "lucide-react";

import {
  ApiError,
  createSellRequest,
  getAddresses,
  getProducts,
  type Address,
  type Product,
} from "@/app/lib/api";

import { useAuth } from "@/app/context/AuthContext";

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const PICKUP_SLOTS = [
  "9:00 AM – 12:00 PM",
  "12:00 PM – 3:00 PM",
  "3:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
];

type SellPhoto = {
  id: string;
  file: File;
  previewUrl: string;
};

type FieldErrors = Record<string, string>;

export default function SellPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  const [working, setWorking] = useState("");
  const [screen, setScreen] = useState("");
  const [condition, setCondition] = useState("");
  const [battery, setBattery] = useState("");

  const [photos, setPhotos] = useState<SellPhoto[]>([]);

  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupSlot, setPickupSlot] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 4;

  /*
   * -------------------------------------------------------
   * PRODUCTS
   * -------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    async function loadPhones() {
      setProductsLoading(true);
      setProductsError("");

      try {
        const response = await getProducts({
          page: 1,
          limit: 100,
          category: "Smartphones",
        });

        if (!response.success) {
          throw new Error(
            response.message || "Unable to load phones",
          );
        }

        if (mounted) {
          setProducts(response.data ?? []);
        }
      } catch (error) {
        if (!mounted) return;

        setProductsError(
          error instanceof Error
            ? error.message
            : "Unable to load phones. Please try again.",
        );
      } finally {
        if (mounted) {
          setProductsLoading(false);
        }
      }
    }

    loadPhones();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * -------------------------------------------------------
   * ADDRESSES
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;

    async function loadAddresses() {
      setAddressesLoading(true);

      try {
        const response = await getAddresses();

        if (!mounted) return;

        if (response.success && response.data) {
          setAddresses(response.data);

          const defaultAddress = response.data.find(
            (address) => address.isDefault,
          );

          if (defaultAddress) {
            setPickupAddress(formatAddress(defaultAddress));
          }
        }
      } catch {
        // Address is optional here because user can manually enter one.
      } finally {
        if (mounted) {
          setAddressesLoading(false);
        }
      }
    }

    loadAddresses();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  /*
   * -------------------------------------------------------
   * DERIVED PRODUCT DATA
   * -------------------------------------------------------
   */

  const phoneProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.category?.trim().toLowerCase() ===
        "smartphones",
    );
  }, [products]);

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        phoneProducts
          .map((product) => product.brand?.trim())
          .filter(Boolean),
      ),
    ).sort();
  }, [phoneProducts]);

  const models = useMemo(() => {
    return Array.from(
      new Set(
        phoneProducts
          .filter(
            (product) =>
              !brand ||
              product.brand?.toLowerCase() ===
                brand.toLowerCase(),
          )
          .map((product) => product.name?.trim())
          .filter(Boolean),
      ),
    ).sort();
  }, [phoneProducts, brand]);

  const selectedProduct = useMemo(() => {
    return phoneProducts.find(
      (product) =>
        product.name === model &&
        product.brand === brand,
    );
  }, [phoneProducts, brand, model]);

  /*
   * -------------------------------------------------------
   * CLEANUP OBJECT URLS
   * -------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, [photos]);

  /*
   * -------------------------------------------------------
   * VALIDATION
   * -------------------------------------------------------
   */

  function validateStep(currentStep: number) {
    const nextErrors: FieldErrors = {};

    if (currentStep === 1) {
      if (!brand) {
        nextErrors.brand = "Please select your phone brand.";
      }

      if (!model) {
        nextErrors.model = "Please select your phone model.";
      }

      if (
        model &&
        brand &&
        !selectedProduct
      ) {
        nextErrors.model =
          "This phone is no longer available. Please select another model.";
      }
    }

    if (currentStep === 2) {
      if (!working) {
        nextErrors.working =
          "Please tell us whether the phone is fully functional.";
      }

      if (!screen) {
        nextErrors.screen =
          "Please select the screen condition.";
      }

      if (!condition) {
        nextErrors.condition =
          "Please select the overall condition.";
      }

      if (!battery) {
        nextErrors.battery =
          "Please select the battery condition.";
      }
    }

    if (currentStep === 3) {
      if (photos.length === 0) {
        nextErrors.photos =
          "Please upload at least one clear photo of your phone.";
      }
    }

    if (currentStep === 4) {
      if (!pickupAddress.trim()) {
        nextErrors.pickupAddress =
          "Please enter your complete pickup address.";
      } else if (pickupAddress.trim().length < 10) {
        nextErrors.pickupAddress =
          "Please enter a more complete pickup address.";
      }

      if (!pickupDate) {
        nextErrors.pickupDate =
          "Please select a pickup date.";
      } else if (isDateInPast(pickupDate)) {
        nextErrors.pickupDate =
          "Pickup date cannot be in the past.";
      }

      if (!pickupSlot) {
        nextErrors.pickupSlot =
          "Please select a pickup time slot.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    setSubmitError("");

    if (!validateStep(step)) {
      return;
    }

    if (step < totalSteps) {
      setStep((current) => current + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function previousStep() {
    setErrors({});
    setSubmitError("");

    if (step > 1) {
      setStep((current) => current - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /*
   * -------------------------------------------------------
   * PHOTOS
   * -------------------------------------------------------
   */

  function handlePhotos(files: FileList | null) {
    if (!files) return;

    setErrors((current) => ({
      ...current,
      photos: "",
    }));

    const incoming = Array.from(files);

    const availableSlots =
      MAX_PHOTOS - photos.length;

    if (availableSlots <= 0) {
      setErrors((current) => ({
        ...current,
        photos: `You can upload a maximum of ${MAX_PHOTOS} photos.`,
      }));
      return;
    }

    const accepted: SellPhoto[] = [];
    let photoError = "";

    for (
      const file of incoming.slice(0, availableSlots)
    ) {
      if (!file.type.startsWith("image/")) {
        photoError =
          "Only image files can be uploaded.";
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        photoError =
          "Each image must be smaller than 5 MB.";
        continue;
      }

      const id =
        `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`;

      accepted.push({
        id,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (accepted.length > 0) {
      setPhotos((current) => [
        ...current,
        ...accepted,
      ]);
    }

    if (
      incoming.length > availableSlots
    ) {
      photoError =
        `You can upload a maximum of ${MAX_PHOTOS} photos.`;
    }

    if (photoError) {
      setErrors((current) => ({
        ...current,
        photos: photoError,
      }));
    }
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const photo = current.find(
        (item) => item.id === id,
      );

      if (photo) {
        URL.revokeObjectURL(photo.previewUrl);
      }

      return current.filter(
        (item) => item.id !== id,
      );
    });
  }

  /*
   * -------------------------------------------------------
   * SUBMIT
   * -------------------------------------------------------
   */

  async function handleSubmit() {
    setSubmitError("");

    if (!validateStep(4)) {
      return;
    }

    if (!selectedProduct) {
      setSubmitError(
        "The selected phone is no longer available. Please go back and select another phone.",
      );
      return;
    }

    if (!isAuthenticated) {
      setSubmitError(
        "Please sign in before scheduling a pickup.",
      );
      return;
    }

    setSubmitting(true);

    try {
      /*
       * IMPORTANT:
       *
       * Do NOT send browser blob URLs to the backend.
       * They only exist inside this browser.
       *
       * Until the R2/S3 upload endpoint is implemented,
       * we intentionally submit the sell request without
       * media URLs.
       *
       * The selected images are still displayed and validated
       * in the UI.
       */

      const response = await createSellRequest({
        productId: selectedProduct.id,

        workingStatus: working,
        screenCondition: screen,
        deviceCondition: condition,
        batteryCondition: battery,

        pickupAddress: pickupAddress.trim(),

        pickupDate: new Date(
          `${pickupDate}T09:00:00`,
        ).toISOString(),

        pickupSlot,
      });

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to create your sell request.",
        );
      }

      window.location.href =
        `/sell/payment?requestId=${encodeURIComponent(
          response.data.id,
        )}`;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setSubmitError(
            "Your session has expired. Please sign in again.",
          );
        } else {
          setSubmitError(
            error.message ||
              "Unable to submit your sell request.",
          );
        }
      } else {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Unable to submit your sell request. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * -------------------------------------------------------
   * AUTH LOADING
   * -------------------------------------------------------
   */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <Loader2
          className="animate-spin text-indigo-600"
          size={28}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      {/* HEADER */}

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to PhoneBhai
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
              <BadgeCheck size={15} />
              Trusted phone selling
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Sell your phone.
              <br />
              <span className="text-indigo-600">
                Get the value you deserve.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500">
              Tell us about your phone, get an estimated
              value and schedule a convenient doorstep
              pickup.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRESS */}

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-5 pb-8 lg:px-8">
          <div className="flex items-center justify-between">
            {[
              ["01", "Phone"],
              ["02", "Condition"],
              ["03", "Photos"],
              ["04", "Pickup"],
            ].map(([number, label], index) => {
              const current = index + 1;
              const active = current === step;
              const completed =
                current < step;

              return (
                <div
                  key={number}
                  className="flex flex-1 items-center"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                        completed
                          ? "bg-green-500 text-white"
                          : active
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completed ? (
                        <Check size={15} />
                      ) : (
                        number
                      )}
                    </div>

                    <span
                      className={`hidden text-xs font-bold sm:block ${
                        active
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {index < 3 && (
                    <div
                      className={`mx-3 h-px flex-1 ${
                        current < step
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        {/* STEP 1 */}

        {step === 1 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Step 1 of 4
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Which phone are you selling?
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Select a phone from our current catalogue.
              </p>

              <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                    <Smartphone
                      size={21}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-indigo-950">
                      Smartphones only
                    </p>

                    <p className="mt-1 text-xs text-indigo-700">
                      PhoneBhai currently accepts smartphones
                      through this selling flow.
                    </p>
                  </div>
                </div>
              </div>

              {productsError && (
                <ErrorMessage>
                  {productsError}
                </ErrorMessage>
              )}

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Brand"
                  error={errors.brand}
                >
                  <select
                    value={brand}
                    onChange={(event) => {
                      setBrand(event.target.value);
                      setModel("");

                      setErrors((current) => ({
                        ...current,
                        brand: "",
                        model: "",
                      }));
                    }}
                    disabled={productsLoading}
                    className={selectClass(
                      errors.brand,
                    )}
                  >
                    <option value="">
                      {productsLoading
                        ? "Loading brands..."
                        : "Select brand"}
                    </option>

                    {brands.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Model"
                  error={errors.model}
                >
                  <select
                    value={model}
                    onChange={(event) => {
                      setModel(event.target.value);

                      setErrors((current) => ({
                        ...current,
                        model: "",
                      }));
                    }}
                    disabled={
                      productsLoading || !brand
                    }
                    className={selectClass(
                      errors.model,
                    )}
                  >
                    <option value="">
                      {!brand
                        ? "Select brand first"
                        : productsLoading
                          ? "Loading models..."
                          : "Select model"}
                    </option>

                    {models.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {selectedProduct && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        Selected phone
                      </p>

                      <p className="mt-1 font-bold">
                        {selectedProduct.brand}{" "}
                        {selectedProduct.name}
                      </p>
                    </div>

                    <p className="text-lg font-black">
                      ₹
                      {Number(
                        selectedProduct.price,
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              )}

              <ValidationSummary
                errors={[
                  errors.brand,
                  errors.model,
                ]}
              />

              <button
                type="button"
                onClick={nextStep}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                Continue
                <ArrowRight size={17} />
              </button>
            </div>

            <SideInfo />
          </div>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Step 2 of 4
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Tell us about the condition
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Accurate answers help us provide a better
                estimate.
              </p>

              <div className="mt-8 space-y-8">
                <Question
                  title="Is the phone fully functional?"
                  icon={<Cpu size={18} />}
                  value={working}
                  onChange={(value) => {
                    setWorking(value);
                    setErrors((current) => ({
                      ...current,
                      working: "",
                    }));
                  }}
                  options={[
                    "Yes, everything works",
                    "Some features don't work",
                  ]}
                  error={errors.working}
                />

                <Question
                  title="What is the screen condition?"
                  icon={<Smartphone size={18} />}
                  value={screen}
                  onChange={(value) => {
                    setScreen(value);
                    setErrors((current) => ({
                      ...current,
                      screen: "",
                    }));
                  }}
                  options={[
                    "Perfect / no scratches",
                    "Minor scratches",
                    "Cracked / damaged",
                  ]}
                  error={errors.screen}
                />

                <Question
                  title="How would you describe the overall condition?"
                  icon={<BadgeCheck size={18} />}
                  value={condition}
                  onChange={(value) => {
                    setCondition(value);
                    setErrors((current) => ({
                      ...current,
                      condition: "",
                    }));
                  }}
                  options={[
                    "Like New",
                    "Good",
                    "Fair",
                    "Poor",
                  ]}
                  error={errors.condition}
                />

                <Question
                  title="What is the battery condition?"
                  icon={<Battery size={18} />}
                  value={battery}
                  onChange={(value) => {
                    setBattery(value);
                    setErrors((current) => ({
                      ...current,
                      battery: "",
                    }));
                  }}
                  options={[
                    "Excellent",
                    "Good",
                    "Needs replacement",
                  ]}
                  error={errors.battery}
                />
              </div>

              <div className="mt-10 flex gap-3">
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-bold transition hover:bg-gray-50"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <SideInfo />
          </div>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Step 3 of 4
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Add photos of your phone
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Clear photos help our team evaluate your
                device accurately.
              </p>

              <label className="mt-8 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Upload
                    className="text-indigo-600"
                    size={22}
                  />
                </div>

                <h3 className="mt-5 font-bold">
                  Upload phone photos
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Upload up to 5 clear photos showing the
                  front, back, sides and condition of your
                  phone.
                </p>

                <span className="mt-5 rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white">
                  Choose Photos
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(event) =>
                    handlePhotos(event.target.files)
                  }
                />
              </label>

              {errors.photos && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  {errors.photos}
                </p>
              )}

              {photos.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold">
                      Selected photos
                    </p>

                    <span className="text-xs font-semibold text-gray-400">
                      {photos.length}/{MAX_PHOTOS}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                      >
                        <img
                          src={photo.previewUrl}
                          alt={`Phone photo ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />

                        <div className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white">
                          Photo {index + 1}
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove photo ${index + 1}`}
                          onClick={() =>
                            removePhoto(photo.id)
                          }
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition hover:bg-red-600"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 rounded-2xl bg-indigo-50 p-5">
                <div className="flex gap-3">
                  <CircleHelp
                    size={19}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-indigo-900">
                      Photo tips
                    </p>

                    <p className="mt-1 text-xs leading-5 text-indigo-700">
                      Use good lighting, clean your camera
                      lens and make sure the phone is clearly
                      visible. Avoid blurry or heavily filtered
                      photos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-bold transition hover:bg-gray-50"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <SideInfo />
          </div>
        )}

        {/* STEP 4 */}

        {step === 4 && (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Step 4 of 4
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Schedule your doorstep pickup
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Choose where and when our pickup executive
                should collect your phone.
              </p>

              {selectedProduct && (
                <div className="mt-8 rounded-3xl bg-[#111827] p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Phone selected
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-2xl font-black">
                        {selectedProduct.brand}{" "}
                        {selectedProduct.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Current catalogue value
                      </p>
                    </div>

                    <p className="text-2xl font-black">
                      ₹
                      {Number(
                        selectedProduct.price,
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <p className="mt-4 text-xs text-gray-400">
                    Your final selling value will be calculated
                    by the backend using the phone and condition
                    information you provided.
                  </p>
                </div>
              )}

              {addresses.length > 0 && (
                <div className="mt-8">
                  <label className="text-sm font-bold">
                    Saved pickup address
                  </label>

                  <select
                    disabled={addressesLoading}
                    onChange={(event) => {
                      const address =
                        addresses.find(
                          (item) =>
                            item.id ===
                            event.target.value,
                        );

                      if (address) {
                        setPickupAddress(
                          formatAddress(address),
                        );
                      }
                    }}
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-indigo-500"
                    defaultValue=""
                  >
                    <option value="">
                      Choose a saved address
                    </option>

                    {addresses.map((address) => (
                      <option
                        key={address.id}
                        value={address.id}
                      >
                        {address.fullName} —{" "}
                        {address.city},{" "}
                        {address.postalCode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-8">
                <Field
                  label="Pickup address"
                  error={errors.pickupAddress}
                >
                  <div
                    className={`flex items-start gap-3 rounded-xl border p-4 ${
                      errors.pickupAddress
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  >
                    <MapPin
                      className="mt-0.5 text-indigo-600"
                      size={19}
                    />

                    <textarea
                      value={pickupAddress}
                      onChange={(event) => {
                        setPickupAddress(
                          event.target.value,
                        );

                        setErrors((current) => ({
                          ...current,
                          pickupAddress: "",
                        }));
                      }}
                      placeholder="Enter your complete pickup address..."
                      className="min-h-24 flex-1 resize-none text-sm outline-none"
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Pickup date"
                  error={errors.pickupDate}
                >
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={pickupDate}
                    onChange={(event) => {
                      setPickupDate(
                        event.target.value,
                      );

                      setErrors((current) => ({
                        ...current,
                        pickupDate: "",
                      }));
                    }}
                    className={inputClass(
                      errors.pickupDate,
                    )}
                  />
                </Field>

                <Field
                  label="Pickup slot"
                  error={errors.pickupSlot}
                >
                  <select
                    value={pickupSlot}
                    onChange={(event) => {
                      setPickupSlot(
                        event.target.value,
                      );

                      setErrors((current) => ({
                        ...current,
                        pickupSlot: "",
                      }));
                    }}
                    className={selectClass(
                      errors.pickupSlot,
                    )}
                  >
                    <option value="">
                      Select a time slot
                    </option>

                    {PICKUP_SLOTS.map((slot) => (
                      <option
                        key={slot}
                        value={slot}
                      >
                        {slot}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-bold text-indigo-950">
                      Pickup booking fee
                    </p>

                    <p className="mt-1 text-xs leading-5 text-indigo-700">
                      A ₹500 booking payment will be required
                      to confirm your pickup. Payment will be
                      handled securely on the next screen.
                    </p>
                  </div>

                  <span className="text-xl font-black text-indigo-950">
                    ₹500
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  {submitError}
                </div>
              )}

              <ValidationSummary
                errors={[
                  errors.pickupAddress,
                  errors.pickupDate,
                  errors.pickupSlot,
                ]}
              />

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Creating your sell request...
                  </>
                ) : (
                  <>
                    Continue to Secure Payment
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={15} />
                Secure process • Your information is protected
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    today.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isDateInPast(value: string) {
  return value < getTodayDate();
}

function formatAddress(address: Address) {
  return [
    address.fullName,
    address.phone,
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

function inputClass(error?: string) {
  return `mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 ${
    error
      ? "border-red-400 focus:border-red-500"
      : "border-gray-200"
  }`;
}

function selectClass(error?: string) {
  return `mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 ${
    error
      ? "border-red-400 focus:border-red-500"
      : "border-gray-200"
  }`;
}

function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
      {children}
    </div>
  );
}

function ValidationSummary({
  errors,
}: {
  errors: Array<string | undefined>;
}) {
  const visibleErrors = errors.filter(
    Boolean,
  ) as string[];

  if (visibleErrors.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-bold text-red-800">
        Please complete the required fields:
      </p>

      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-700">
        {visibleErrors.map((error, index) => (
          <li key={`${error}-${index}`}>
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-bold">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   QUESTION
========================================================= */

function Question({
  title,
  icon,
  value,
  onChange,
  options,
  error,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
          {icon}
        </div>

        <h3 className="text-sm font-bold">
          {title}
        </h3>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              type="button"
              key={option}
              onClick={() => onChange(option)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm transition ${
                selected
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{option}</span>

              {selected && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Check size={12} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SIDE INFO
========================================================= */

function SideInfo() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold">
          Why sell with PhoneBhai?
        </p>

        <div className="mt-6 space-y-5">
          <InfoItem
            icon={<Truck size={18} />}
            title="Doorstep pickup"
            text="Choose a convenient pickup slot."
          />

          <InfoItem
            icon={<ShieldCheck size={18} />}
            title="Secure process"
            text="Your information stays protected."
          />

          <InfoItem
            icon={<BadgeCheck size={18} />}
            title="Fair evaluation"
            text="Transparent device inspection."
          />

          <InfoItem
            icon={<ImageIcon size={18} />}
            title="Photo evaluation"
            text="Share clear device photos for inspection."
          />
        </div>

        <div className="mt-7 border-t border-gray-100 pt-5">
          <p className="text-xs leading-5 text-gray-400">
            Final pricing is determined after physical
            inspection and may differ from the initial
            estimate.
          </p>
        </div>
      </div>
    </aside>
  );
}

function InfoItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
}