export interface Cabin {
  id: number;
  name: string;
  description: string;
  price: number;
  discount?: number;
  image: string;
  images: string[];
  maxCapacity: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  amenities: string[];
  location: {
    region: string;
    coordinates: { lat: number; lng: number };
  };
  rating: number;
  reviewCount: number;
}

export async function getCabins(): Promise<Cabin[]> {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return [
    {
      id: 1,
      name: "پناهگاه آلپاین",
      description:
        "سوئیتی لوکس در دامنه‌های سبز البرز با منظره پانورامایی به کوهستان. این اقامتگاه با معماری مدرن و مصالح طبیعی چوب و سنگ، تجربه‌ای بی‌نظیر از آسایش در دل طبیعت شمال کشور فراهم می‌کند.",
      price: 299,
      discount: 15,
      image:
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
      ],
      maxCapacity: 4,
      size: 120,
      bedrooms: 2,
      bathrooms: 2,
      features: ["منظره کوه", "شومینه", "وان آب گرم", "بالکن"],
      amenities: ["Wi-Fi رایگان", "پارکینگ", "سرویس اتاق", "صبحانه"],
      location: {
        region: "مازندران - البرز مرکزی",
        coordinates: { lat: 36.2605, lng: 51.6371 },
      },
      rating: 4.9,
      reviewCount: 127,
    },
    {
      id: 2,
      name: "پناهگاه جنگلی",
      description:
        "مستقر در قلب جنگل‌های هزارساله‌ی هیرکانی، این سوئیت فضایی وسیع برای خانواده‌ها و گروه‌ها فراهم می‌کند. با طراحی باز و پنجره‌های نورگیر، جنگل مه‌آلود شمال را به درون اقامتگاه دعوت می‌کند.",
      price: 399,
      image:
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop",
      ],
      maxCapacity: 6,
      size: 180,
      bedrooms: 3,
      bathrooms: 2,
      features: ["دید پانوراما", "شومینه", "استخر بازیابی", "اتاق بازی کودکان"],
      amenities: ["Wi-Fi رایگان", "پارکینگ", "سرویس اتاق", "صبحانه", "BBQ"],
      location: {
        region: "گیلان - جنگل‌های هیرکانی",
        coordinates: { lat: 35.6892, lng: 51.389 },
      },
      rating: 4.8,
      reviewCount: 89,
    },
    {
      id: 3,
      name: "قله لوکس",
      description:
        "لوکس‌ترین اقامتگاه مجموعه با امکانات کامل برای اقامت گروه‌های بزرگ. طراحی معماری منحصربه‌فرد با سقف‌های بلند و پنجره‌های سراسری، منظره‌ی روستاهای ییلاقی شرق استان مازندران را به نمایش می‌گذارد.",
      price: 549,
      discount: 10,
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=2070&auto=format&fit=crop",
      ],
      maxCapacity: 10,
      size: 250,
      bedrooms: 4,
      bathrooms: 3,
      features: ["استخر خصوصی", "سونا", "سینمای خانگی", "آشپزخانه مجهز"],
      amenities: [
        "Wi-Fi رایگان",
        "پارکینگ",
        "سرویس اتاق ۲۴ ساعته",
        "صبحانه",
        "BBQ",
        "جکوزی",
      ],
      location: {
        region: "مازندران - ییلاقات کلاردشت",
        coordinates: { lat: 36.3, lng: 51.7 },
      },
      rating: 4.95,
      reviewCount: 203,
    },
    {
      id: 4,
      name: "سوئیت ساحلی آفتابی",
      description:
        "سوئیتی مدرن با طراحی مینیمال در چند قدمی ساحل شنی دریای خزر؛ جایی که نور طبیعی و صدای موج به اوج می‌رسد. مناسب برای زوج‌ها و خانواده‌های کوچک که به دنبال سکوت و آرامش کنار آب هستند.",
      price: 449,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop",
      ],
      maxCapacity: 4,
      size: 150,
      bedrooms: 2,
      bathrooms: 2,
      features: ["منظره دریا", "شومینه چوبی", "تراس رو به خزر", "اتاق مطالعه"],
      amenities: [
        "Wi-Fi رایگان",
        "پارکینگ",
        "سرویس اتاق",
        "صبحانه",
        "اسپا",
      ],
      location: {
        region: "گیلان - ساحل چمخاله",
        coordinates: { lat: 37.1808, lng: 50.1736 },
      },
      rating: 4.7,
      reviewCount: 64,
    },
    {
      id: 5,
      name: "عمارت جنگلی",
      description:
        "اقامتگاهی وسیع و باشکوه با طراحی الهام‌گرفته از معماری سنتی شمال ایران و لمسات مدرن. ایده‌آل برای گردهمایی‌های بزرگ خانوادگی و جشن‌ها در دل جنگل‌های سرسبز.",
      price: 699,
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
      ],
      maxCapacity: 12,
      size: 300,
      bedrooms: 5,
      bathrooms: 4,
      features: ["سالن بزرگ", "استخر بی‌نهایت", "سینما", "بازیگاه کودکان"],
      amenities: [
        "Wi-Fi رایگان",
        "پارکینگ وسیع",
        "سرویس ۲۴ ساعته",
        "صبحانه کامل",
        "BBQ",
        "جکوزی",
        "سالن کنفرانس",
      ],
      location: {
        region: "مازندران - جنگل‌های نوشهر",
        coordinates: { lat: 36.6488, lng: 51.4962 },
      },
      rating: 4.9,
      reviewCount: 156,
    },
    {
      id: 6,
      name: "اقامتگاه ستاره‌ها",
      description:
        "اقامتگاهی منحصربه‌فرد با سقف شیشه‌ای و منظره بی‌نظیر به آسمان پرستاره‌ی کویر؛ مجهز به تلسکوپ حرفه‌ای برای رصد شب‌های صاف شرق کشور.",
      price: 379,
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
      ],
      maxCapacity: 3,
      size: 100,
      bedrooms: 1,
      bathrooms: 1,
      features: ["تلسکوپ", "سقف شیشه‌ای", "شومینه", "جکوزی بیرونی"],
      amenities: ["Wi-Fi رایگان", "پارکینگ", "سرویس اتاق", "صبحانه رمانتیک"],
      location: {
        region: "خراسان جنوبی - کویر",
        coordinates: { lat: 33.8, lng: 57.5 },
      },
      rating: 4.85,
      reviewCount: 78,
    },
  ];
}

export async function getCabin(id: number): Promise<Cabin | undefined> {
  const cabins = await getCabins();
  return cabins.find((cabin) => cabin.id === id);
}

export function filterCabins(
  cabins: Cabin[],
  filter: string
): Cabin[] {
  if (filter === "all") return cabins;
  if (filter === "small") return cabins.filter((c) => c.maxCapacity <= 3);
  if (filter === "medium")
    return cabins.filter((c) => c.maxCapacity > 3 && c.maxCapacity < 8);
  if (filter === "large") return cabins.filter((c) => c.maxCapacity >= 8);
  return cabins;
}