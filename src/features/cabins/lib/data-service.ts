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
        "یک کابین لوکس در میان قله‌های باشکوه با منظره پانورامایی به کوهستان. این کابین با طراحی معماری مدرن و موادی طبیعی، تجربه‌ای بی‌نظیر از آسایش در دل طبیعت را فراهم می‌کند.",
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
        region: "منطقه شمال",
        coordinates: { lat: 36.2605, lng: 51.6371 },
      },
      rating: 4.9,
      reviewCount: 127,
    },
    {
      id: 2,
      name: "پناهگاه جنگلی",
      description:
        "مستقر در قلب جنگل‌های بکر، این کابین فضایی وسیع برای خانواده‌ها و گروه‌ها فراهم می‌کند. با طراحی باز و نوری، طبیعت را به درون دعوت می‌کند.",
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
      features: ["دید پانوراما", "شومینه", "استخر بازیابی", "سالن permainan"],
      amenities: ["Wi-Fi رایگان", "پارکینگ", "سرویس اتاق", "صبحانه", "BBQ"],
      location: {
        region: "منطقه غرب",
        coordinates: { lat: 35.6892, lng: 51.389 },
      },
      rating: 4.8,
      reviewCount: 89,
    },
    {
      id: 3,
      name: "قله لوکس",
      description:
        "شلوغ‌ترین و لوکس‌ترین کابین مجموعه با امکانات کامل برای اقامت گروه‌های بزرگ. طراحی arquitectural منحصر به فرد با سقف‌های بلند و پنجره‌های سقف تا کف.",
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
        region: "منطقه شرق",
        coordinates: { lat: 36.3, lng: 51.7 },
      },
      rating: 4.95,
      reviewCount: 203,
    },
    {
      id: 4,
      name: "ویلا آفتابی",
      description:
        "یک ویلا مدرن با طراحی مینیمال که نور طبیعی را به بیشینه می‌رساند. مناسب برای parejas و خانواده‌های کوچک که به دنبال سکوت و آرامش هستند.",
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
      features: ["منظره دریا", "شومینه بیواتی", "تراس رویی", "مطالعات"],
      amenities: [
        "Wi-Fi رایگان",
        "پارکینگ",
        "سرویس اتاق",
        "صبحانه",
        "اسپا",
      ],
      location: {
        region: "منطقه جنوب",
        coordinates: { lat: 35.5, lng: 51.5 },
      },
      rating: 4.7,
      reviewCount: 64,
    },
    {
      id: 5,
      name: "کاخ جنگلی",
      description:
        "فضای وسیع و hoàng gia با طراحی مستوحا از معماری سنتی با لمسات مدرن. ایده‌آل برای گردهمایی‌های بزرگ و جشن‌های семейی.",
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
        region: "منطقه مرکزی",
        coordinates: { lat: 35.7, lng: 51.4 },
      },
      rating: 4.9,
      reviewCount: 156,
    },
    {
      id: 6,
      name: "ملک ستاره‌داره",
      description:
        "یک ملک منحصر به فرد با طراحی کاکلسی و منظره بی‌نظیر به ستاره‌های شب. مجهز به تلسکوپ حرفه‌ای برای رصد ستارگان.",
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
        region: "منطقه شمال",
        coordinates: { lat: 36.3, lng: 51.65 },
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