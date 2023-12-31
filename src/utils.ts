import { ITenant, Language } from "@/contexts/AppContexts";
import { StepType } from "@reactour/tour";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFloorLocal(floor: string, language: Language) {
  switch (floor) {
    case "GR":
      return language === Language.ع ? "الطابق الارضي" : "Ground Floor";
    case "F1":
      return language === Language.ع ? "الطابق الاول" : "First Floor";
    case "F2":
      return language === Language.ع ? "الطابق الثاني" : "Second Floor";
    default:
      return floor;
  }
}

export function getSteps(language?: Language) {
  const isAr = language === Language.ع;

  const steps: StepType[] = [
    {
      selector: ".step-1",
      content: isAr ? "تغيير اللغة (English?)" : "Change language (العربية؟)",
    },
    {
      selector: ".step-2",
      content: isAr
        ? ".يمكنك التكبير والتصغير باستخدام الأزرار التالية"
        : "You can zoom in and out using the following buttons.",
    },
    {
      selector: ".step-3",
      content: isAr
        ? ".يمكنك تحديد مبنى بالضغط على المبنى في الخريطة أو بالضغط على أحد الأزرار التالية"
        : "You can select a building by clicking on it in the map or by clicking on one of the buttons bellow.",
    },
    {
      selector: ".step-4",
      content: isAr
        ? ".يمكنك البحث عن مكان من هنا"
        : "You can search places here.",
    },
  ];

  return steps;
}

export function getName(tenant: ITenant, language: Language) {
  const en = tenant.name;
  const ar = tenant.ar_name;

  const isAr = language === Language.ع;

  if (isAr) {
    return ar || en || "غير معروف";
  } else {
    return en || ar || "Unknown";
  }
}
