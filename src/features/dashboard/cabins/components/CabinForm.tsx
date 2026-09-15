"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MapPin, Save } from "lucide-react";

import Button from "@/components/ui/Button";
import CardDashContainer from "@/features/dashboard/components/CardDashContainer";
import type { Cabin } from "@/features/cabins/lib/data-service";
import type { City } from "@/features/cabins/types/City";
import CabinImageDropzone, { type CabinImage } from "./CabinImageDropzone";
import { splitImages } from "../lib/cabin-images";
import { createCabinAction, updateCabinAction } from "../lib/cabin-actions";
import { useRouter } from "next/navigation";

type Mode = "add" | "edit";

export type CabinFormValues = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  cityId: number;
  amenities: string;
  images: CabinImage[];
};

interface CabinFormProps {
  mode: Mode;
  cities: City[];
  cabin?: Cabin;
}

function getDefaultValues(cabin?: Cabin): CabinFormValues {
  return {
    name: cabin?.name ?? "",
    maxCapacity: cabin?.maxCapacity ?? 1,
    regularPrice: cabin?.regularPrice ?? 0,
    discount: cabin?.discount ?? 0,
    description: cabin?.description ?? "",
    bedrooms: cabin?.bedrooms ?? 0,
    bathrooms: cabin?.bathrooms ?? 0,
    areaSqm: cabin?.areaSqm ?? 0,
    cityId: cabin?.city?.id ?? 0,
    amenities: cabin?.amenities?.join(", ") ?? "",
    images:
      cabin?.images?.map((src, index) => ({
        id: `existing-${cabin.id}-${index}`,
        src,
      })) ?? [],
  };
}

const inputClass =
  "border-border bg-background text-text placeholder:text-text-gray focus:border-primary-400 focus:ring-primary-400/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4";

const labelClass = "text-text mb-2 block text-sm font-semibold";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-danger mt-1.5 text-xs">{message}</p>;
}

function buildFormData(values: CabinFormValues): FormData {
  const { keepExisting, newFiles } = splitImages(values.images);

  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("maxCapacity", String(values.maxCapacity));
  formData.append("regularPrice", String(values.regularPrice));
  formData.append("discount", String(values.discount));
  formData.append("description", values.description);
  formData.append("bedrooms", String(values.bedrooms));
  formData.append("bathrooms", String(values.bathrooms));
  formData.append("areaSqm", String(values.areaSqm));
  formData.append("cityId", String(values.cityId));
  formData.append(
    "amenities",
    JSON.stringify(
      values.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    ),
  );
  formData.append("keepExistingImages", JSON.stringify(keepExisting));
  newFiles.forEach((file) => formData.append("newImages", file));

  return formData;
}

export default function CabinForm({ mode, cities, cabin }: CabinFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CabinFormValues>({
    defaultValues: getDefaultValues(cabin),
  });
  const router = useRouter()

  useEffect(() => {
    reset(getDefaultValues(cabin));
  }, [cabin, reset]);

  async function onSubmit(values: CabinFormValues) {
    const formData = buildFormData(values);
    // console.log(values);
    
    // 🔑 کلاینت فقط server action رو صدا می‌زنه — نه API، نه توکن، هیچی
    const result =
      mode === "add"
        ? await createCabinAction(formData)
        : await updateCabinAction(cabin!.id, formData);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/cabins");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () =>
        toast.error("لطفاً خطاهای فرم را بررسی کنید."),
      )}
      className="flex flex-col gap-6"
    >
      <CardDashContainer noTransition>
        <div className="mb-6">
          <h3 className="text-text text-lg font-bold">اطلاعات اصلی</h3>
          <p className="text-text-gray mt-1 text-sm">
            مشخصات و ظرفیت سوییت را وارد کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              نام سوییت
            </label>
            <input
              id="name"
              {...register("name", { required: "نام سوییت الزامی است." })}
              placeholder="مثلاً ویلا جنگلی ماسال"
              className={inputClass}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <label htmlFor="cityId" className={labelClass}>
              شهر
            </label>
            <select
              id="cityId"
              {...register("cityId", {
                valueAsNumber: true,
                validate: (value) => value > 0 || "انتخاب شهر الزامی است.",
              })}
              className={inputClass}
            >
              <option value={0}>انتخاب شهر</option>
              {cities.map((city) => (
                <option value={city.id} key={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.cityId?.message} />
          </div>

          <div>
            <label htmlFor="maxCapacity" className={labelClass}>
              حداکثر ظرفیت (نفر)
            </label>
            <input
              id="maxCapacity"
              type="number"
              min={1}
              {...register("maxCapacity", {
                valueAsNumber: true,
                required: "ظرفیت الزامی است.",
                min: { value: 1, message: "ظرفیت باید حداقل ۱ نفر باشد." },
              })}
              className={inputClass}
            />
            <FieldError message={errors.maxCapacity?.message} />
          </div>

          <div>
            <label htmlFor="areaSqm" className={labelClass}>
              متراژ (مترمربع)
            </label>
            <input
              id="areaSqm"
              type="number"
              min={1}
              {...register("areaSqm", {
                valueAsNumber: true,
                required: "متراژ الزامی است.",
                min: { value: 1, message: "متراژ باید بیشتر از صفر باشد." },
              })}
              className={inputClass}
            />
            <FieldError message={errors.areaSqm?.message} />
          </div>

          <div>
            <label htmlFor="bedrooms" className={labelClass}>
              تعداد اتاق خواب
            </label>
            <input
              id="bedrooms"
              type="number"
              min={0}
              {...register("bedrooms", {
                valueAsNumber: true,
                min: { value: 0, message: "تعداد اتاق خواب معتبر نیست." },
              })}
              className={inputClass}
            />
            <FieldError message={errors.bedrooms?.message} />
          </div>

          <div>
            <label htmlFor="bathrooms" className={labelClass}>
              تعداد سرویس بهداشتی
            </label>
            <input
              id="bathrooms"
              type="number"
              min={0}
              {...register("bathrooms", {
                valueAsNumber: true,
                min: { value: 0, message: "تعداد سرویس معتبر نیست." },
              })}
              className={inputClass}
            />
            <FieldError message={errors.bathrooms?.message} />
          </div>
        </div>
      </CardDashContainer>

      <CardDashContainer noTransition>
        <div className="mb-6">
          <h3 className="text-text text-lg font-bold">قیمت‌گذاری</h3>
          <p className="text-text-gray mt-1 text-sm">
            قیمت‌ها را به تومان وارد کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="regularPrice" className={labelClass}>
              قیمت پایه (تومان)
            </label>
            <input
              id="regularPrice"
              type="number"
              min={0}
              {...register("regularPrice", {
                valueAsNumber: true,
                required: "قیمت پایه الزامی است.",
                min: { value: 0, message: "قیمت نمی‌تواند منفی باشد." },
              })}
              className={inputClass}
            />
            <FieldError message={errors.regularPrice?.message} />
          </div>

          <div>
            <label htmlFor="discount" className={labelClass}>
              تخفیف (تومان)
            </label>
            <input
              id="discount"
              type="number"
              min={0}
              {...register("discount", {
                valueAsNumber: true,
                min: { value: 0, message: "تخفیف نمی‌تواند منفی باشد." },
                validate: (value) =>
                  value <= getValues("regularPrice") ||
                  "تخفیف نمی‌تواند از قیمت پایه بیشتر باشد.",
              })}
              className={inputClass}
            />
            <FieldError message={errors.discount?.message} />
          </div>
        </div>
      </CardDashContainer>

      <CardDashContainer noTransition>
        <div className="mb-6">
          <h3 className="text-text text-lg font-bold">توضیحات و امکانات</h3>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="description" className={labelClass}>
              توضیحات
            </label>
            <textarea
              id="description"
              rows={5}
              {...register("description", {
                required: "توضیحات الزامی است.",
                minLength: {
                  value: 20,
                  message: "توضیحات باید حداقل ۲۰ کاراکتر باشد.",
                },
              })}
              placeholder="توضیح کاملی درباره سوییت بنویسید..."
              className={`${inputClass} resize-y`}
            />
            <FieldError message={errors.description?.message} />
          </div>

          <div>
            <label htmlFor="amenities" className={labelClass}>
              امکانات
            </label>
            <input
              id="amenities"
              {...register("amenities")}
              placeholder="استخر، پارکینگ، وای‌فای، باربیکیو"
              className={inputClass}
            />
            <p className="text-text-gray mt-1.5 text-xs">
              امکانات را با کاما از هم جدا کنید.
            </p>
          </div>
        </div>
      </CardDashContainer>

      <CardDashContainer noTransition>
        <div className="mb-6">
          <h3 className="text-text text-lg font-bold">تصاویر سوییت</h3>
          <p className="text-text-gray mt-1 text-sm">
            تصاویر با امکان کشیدن و رها کردن قابل انتخاب هستند.
          </p>
        </div>

        <Controller
          name="images"
          control={control}
          rules={{
            validate: (images) =>
              images.length > 0 || "حداقل یک عکس برای سوییت انتخاب کنید.",
          }}
          render={({ field }) => (
            <CabinImageDropzone
              value={field.value}
              onChange={field.onChange}
              maxImages={10}
            />
          )}
        />
        <FieldError message={errors.images?.message} />
      </CardDashContainer>

      <CardDashContainer noTransition>
        <div className="mb-6">
          <h3 className="text-text text-lg font-bold">موقعیت مکانی</h3>
          <p className="text-text-gray mt-1 text-sm">
            این بخش فعلاً برای اضافه شدن نقشه در آینده آماده شده است.
          </p>
        </div>

        <div className="border-border bg-background-2/50 text-text-gray flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed">
          <div className="bg-primary-400/10 text-primary-500 grid size-12 place-items-center rounded-full">
            <MapPin className="size-6" />
          </div>
          <span className="text-sm">محل نمایش نقشه در آینده</span>
        </div>
      </CardDashContainer>

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Button
          href="/dashboard/cabins"
          variant="outline"
          size="md"
          shape="xl"
          type="button"
        >
          انصراف
        </Button>
        <Button
          variant="primary"
          size="md"
          shape="xl"
          type="submit"
          disabled={isSubmitting}
        >
          <Save className="size-4" />
          {isSubmitting
            ? "در حال پردازش..."
            : mode === "add"
              ? "ثبت سوییت"
              : "ذخیره تغییرات"}
        </Button>
      </div>
    </form>
  );
}
