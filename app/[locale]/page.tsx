"use client";

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="flex size-full min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div>
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            تسجيل الدخول
          </Link>
        </div>
        <div>
          <ChatbotUISVG
            theme={theme === "dark" ? "dark" : "light"}
            scale={0.2}
          />
        </div>
      </nav>

      <div className="flex grow flex-col items-center justify-center">
        <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
          LawgicAI
        </h1>
        <p className="text-s mt-2 text-center text-gray-600 dark:text-gray-300">
          منصة الذكاء الاصطناعي للاستشارات القانونية السعودية
        </p>

        <Link
          className="mt-6 flex w-[250px] items-center justify-center rounded-md bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700"
          href="/login"
        >
          <IconArrowLeft className="mr-2" size={24} />
          بدء الدردشة الآن
        </Link>
      </div>
    </div>
  );
}
