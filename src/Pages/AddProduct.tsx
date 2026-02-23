import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { addProduct } from "../API/Functions/addProduct.api";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Listbox } from "@headlessui/react";
import { useState, useEffect } from "react";

/* ───────────────── Schema ───────────────── */

const schema = yup.object({
  title: yup
    .string()
    .required("Product title is required")
    .min(3, "Minimum 3 characters")
    .defined(),
  category: yup.string().required("Category is required").defined(),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price cannot be negative")
    .defined(),
  rating: yup
    .number()
    .typeError("Rating must be a number")
    .required("Rating is required")
    .min(0, "Minimum rating is 0")
    .max(5, "Maximum rating is 5")
    .defined(),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Minimum 10 characters")
    .defined(),
  image: yup
    .string()
    .required("Image URL is required")
    .url("Must be a valid URL")
    .defined(),
  active: yup.boolean().default(true).defined(),
});

type FormData = {
  title: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  active: boolean;
};

/* ───────────────── Variants ───────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const fieldVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/* ───────────────── Shared Styles ───────────────── */

const inputClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#22C55E] outline-none transition-all duration-200 hover:border-gray-300 shadow-sm";

/* ───────────────── Field Wrapper ───────────────── */

const Field: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  hint?: string;
}> = ({ label, error, children, icon, hint }) => (
  <motion.div variants={fieldVariants} className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
      {icon && <span className="text-[#22C55E]">{icon}</span>}
      {label}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          key={error}
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-red-500 flex items-center gap-1"
        >
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ───────────────── Section Header ───────────────── */

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  step: string;
}> = ({ icon, title, subtitle, step }) => (
  <div className="flex items-center gap-4 mb-7">
    <div className="relative flex-shrink-0">
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#22C55E] to-green-600 flex items-center justify-center shadow-lg shadow-green-200/60">
        <span className="text-white">{icon}</span>
      </div>
      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gray-900 text-white text-[9px] font-bold flex items-center justify-center leading-none">
        {step}
      </span>
    </div>
    <div>
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

/* ───────────────── Shimmer Button ───────────────── */

const ShimmerButton: React.FC<{
  type?: "submit" | "button";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}> = ({ type = "button", disabled, onClick, className = "", children }) => (
  <motion.button
    type={type}
    disabled={disabled}
    onClick={onClick}
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.97 }}
    className={`relative overflow-hidden flex items-center gap-2 ${className}`}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
      initial={{ x: "-100%" }}
      animate={{ x: "200%" }}
      transition={{
        repeat: Infinity,
        repeatDelay: 3.5,
        duration: 0.75,
        ease: "easeInOut",
      }}
    />
    {children}
  </motion.button>
);

const categories = ["Electronics", "Clothing", "Accessories"];



const CategorySelect = ({ value, onChange }: any) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        
        {/* Button */}
        <Listbox.Button
          className="
          w-full
          h-[42px]                    
          rounded-xl
          border border-gray-200
          bg-white
          px-4
          text-sm
          text-gray-800
          text-left
          shadow-sm
          transition-all duration-200

          hover:border-[#22C55E]
          hover:shadow-md

          focus:outline-none
          focus:ring-4
          focus:ring-green-100
          focus:border-[#22C55E]

          flex items-center justify-between
          "
        >
          <span className={`${!value && "text-gray-400"}`}>
            {value || "Select category"}
          </span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </Listbox.Button>

        {/* Options */}
        <Listbox.Options
          className="
          absolute
          z-50
          w-full
          mt-2
          bg-white
          border border-gray-200
          rounded-xl
          shadow-lg
          overflow-hidden
          animate-in fade-in zoom-in-95
          "
        >
          {categories.map((cat) => (
            <Listbox.Option key={cat} value={cat}>
              {({ active, selected }) => (
                <div
                  className={`
                  px-4 py-2.5
                  text-sm
                  cursor-pointer
                  flex items-center justify-between
                  transition-all duration-150

                  ${
                    active
                      ? "bg-green-50 text-[#22C55E]"
                      : "text-gray-700"
                  }
                  `}
                >
                  {cat}

                  {selected && (
                    <svg
                      className="w-4 h-4 text-[#22C55E]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>

      </div>
    </Listbox>
  );
};
/* ───────────────── Main Component ───────────────── */

const AddProduct: React.FC = () => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [imgStatus, setImgStatus] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: { active: true },
  });

  const imageUrl = watch("image");

  /* ── Instant image preview with short debounce ── */
  useEffect(() => {
    if (!imageUrl || imageUrl.trim() === "") {
      setImgSrc("");
      setImgStatus("idle");
      return;
    }
    try {
      new URL(imageUrl);
    } catch {
      setImgStatus("error");
      setImgSrc("");
      return;
    }
    setImgStatus("loading");
    const timer = setTimeout(() => {
      setImgSrc(imageUrl.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  const handleReset = () => {
    reset();
    setImgSrc("");
    setImgStatus("idle");
  };

  const onSubmit = async (input: FormData) => {
    try {
      const payload = {
        title: input.title,
        price: input.price,
        description: input.description,
        rating: input.rating,
        image: input.image,
        category: input.category,
      };
      const response = await addProduct(payload);
      toast.success("Product created successfully 🎉", {
        description: "Your product has been added to the store.",
      });
      console.log("API Response:", response.data);
      handleReset();
    } catch (error: any) {
      console.error("Add Product Error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error("Failed to create product ❌", { description: message });
    }
  };

  return (
    <div className="relative min-h-full bg-[#f7faf7] p-4 sm:p-6 lg:p-8">
      {/* ── Ambient blobs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] opacity-40"
          style={{
            background:
              "radial-gradient(circle at 70% 20%, #bbf7d0 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 80%, #dcfce7 0%, transparent 65%)",
          }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: "radial-gradient(#22C55E 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-5"
        >
          {/* ══════════ HEADER ══════════ */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 18,
                  delay: 0.1,
                }}
                className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#22C55E] via-green-500 to-green-700 flex items-center justify-center shadow-xl shadow-green-300/40 flex-shrink-0"
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </motion.div>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex flex-wrap items-center gap-2"
                >
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Add New Product
                  </h1>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22C55E] bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                    Live Preview On
                  </span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.27, duration: 0.4 }}
                  className="text-sm text-gray-500 mt-0.5"
                >
                  Fill in the details below to publish a new product to your
                  store.
                </motion.p>
              </div>
            </div>

            {/* Single set of action buttons (top only) */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-3 flex-shrink-0"
            >
              <motion.button
                type="button"
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset
              </motion.button>

              <ShimmerButton
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-green-500 text-white text-sm font-bold shadow-lg shadow-green-300/40 hover:shadow-green-400/50 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.span
                      key="s"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-30"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-80"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Publishing...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="p"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Publish Product
                    </motion.span>
                  )}
                </AnimatePresence>
              </ShimmerButton>
            </motion.div>
          </motion.div>

          {/* ══════════ STEP TRAIL ══════════ */}
          <motion.div
            variants={cardVariants}
            className="flex items-center gap-3"
          >
            {[
              { n: "1", label: "Basic Info" },
              { n: "2", label: "Media" },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center shadow shadow-green-200">
                    <span className="text-white text-[10px] font-bold">
                      {s.n}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-12 h-px bg-gradient-to-r from-[#22C55E]/50 to-gray-200" />
                )}
              </div>
            ))}
          </motion.div>

          {/* ══════════ BASIC INFO CARD ══════════ */}
          <motion.div
            variants={cardVariants}
            className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden"
            style={{
              boxShadow:
                "0 2px 20px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(34,197,94,0.05)",
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#22C55E] via-green-400 to-green-300/30" />
            {/* Decorative circle */}
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-green-50 opacity-60" />
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-green-100 opacity-40" />

            <div className="relative p-6 sm:p-8">
              <SectionHeader
                step="1"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                }
                title="Basic Information"
                subtitle="Core details displayed to customers on the product listing"
              />

              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <Field
                  label="Product Title"
                  error={errors.title?.message}
                  icon={
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 7h10M7 12h6"
                      />
                    </svg>
                  }
                >
                  <input
                    {...register("title")}
                    type="text"
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    className={inputClass}
                  />
                </Field>

                <Field label="Category" error={errors.category?.message}>
                  <CategorySelect
                    value={watch("category")}
                    onChange={(val: string) => setValue("category", val)}
                  />
                </Field>

                <Field
                  label="Price"
                  error={errors.price?.message}
                  icon={
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold select-none">
                      ₹
                    </span>
                    <input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      placeholder="0.00"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </Field>

                <Field
                  label="Rating"
                  error={errors.rating?.message}
                  hint="Enter a value between 0.0 and 5.0"
                  icon={
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  }
                >
                  <input
                    {...register("rating", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                    className={inputClass}
                  />
                </Field>

                {/* Description — full width */}
                <motion.div
                  variants={fieldVariants}
                  className="md:col-span-2 flex flex-col gap-1.5"
                >
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <span className="text-[#22C55E]">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M4 10h16M4 14h10"
                        />
                      </svg>
                    </span>
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Write a compelling product description that highlights key features and benefits..."
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                  <AnimatePresence mode="wait">
                    {errors.description && (
                      <motion.p
                        key={errors.description.message}
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        className="text-xs text-red-500 flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.description.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* ══════════ MEDIA CARD ══════════ */}
          <motion.div
            variants={cardVariants}
            className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden"
            style={{
              boxShadow:
                "0 2px 20px -4px rgba(0,0,0,0.07), 0 0 0 1px rgba(34,197,94,0.05)",
            }}
          >
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-green-300/30 via-[#22C55E] to-green-400" />
            {/* Decorative circles */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-green-50 opacity-60" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-green-100 opacity-40" />

            <div className="relative p-6 sm:p-8">
              <SectionHeader
                step="2"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
                title="Product Media"
                subtitle="Paste an image URL — the preview updates instantly as you type"
              />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* Input + status */}
                <div className="lg:col-span-2 flex flex-col gap-3">
                  <Field
                    label="Image URL"
                    error={errors.image?.message}
                    hint="Supports JPG, PNG, WEBP, GIF direct links"
                    icon={
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    }
                  >
                    <input
                      {...register("image")}
                      type="text"
                      placeholder="https://example.com/product.jpg"
                      className={inputClass}
                    />
                  </Field>

                  {/* Status pill */}
                  <AnimatePresence mode="wait">
                    {imgStatus === "loaded" && (
                      <motion.div
                        key="ok"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="flex items-center gap-2 text-xs font-bold text-[#22C55E] bg-green-50 border border-green-200 rounded-xl px-3 py-2 w-fit"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Image loaded
                      </motion.div>
                    )}
                    {imgStatus === "error" && (
                      <motion.div
                        key="err"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2 w-fit"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Couldn't load image
                      </motion.div>
                    )}
                    {imgStatus === "loading" && (
                      <motion.div
                        key="ld"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-fit"
                      >
                        <svg
                          className="w-3.5 h-3.5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Loading preview...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Preview box */}
                <div className="lg:col-span-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Live Preview
                  </p>
                  <div
                    className="relative rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-green-50/30 overflow-hidden flex items-center justify-center"
                    style={{ minHeight: "230px" }}
                  >
                    <AnimatePresence mode="wait">
                      {imgSrc && imgStatus !== "error" ? (
                        <motion.div
                          key={imgSrc}
                          initial={{ opacity: 0, scale: 1.03 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute inset-0"
                        >
                          <img
                            src={imgSrc}
                            onLoad={() => setImgStatus("loaded")}
                            onError={() => setImgStatus("error")}
                            alt="Product Preview"
                            className="w-full h-full object-cover"
                          />
                          {/* Bottom gradient overlay */}
                          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                          <AnimatePresence>
                            {imgStatus === "loaded" && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#22C55E] text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                                Live Preview
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center gap-3 p-8"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-400 font-medium text-center max-w-[200px]">
                            {imgStatus === "error"
                              ? "Couldn't load the image — please check the URL"
                              : "Paste an image URL on the left to see a live preview here"}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ══════════ FOOTER INFO BAR ══════════ */}
          <motion.div
            variants={cardVariants}
            className="flex items-center justify-between pb-4"
          >
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <svg
                className="w-4 h-4 text-[#22C55E] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>
                All fields are required. Your data is handled securely.
              </span>
            </div>
          </motion.div>
        </motion.div>
      </form>
    </div>
  );
};

export default AddProduct;
