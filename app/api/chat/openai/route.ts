// import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
// import { ChatSettings } from "@/types"
// import { OpenAIStream, StreamingTextResponse } from "ai"
// import { ServerRuntime } from "next"
// import OpenAI from "openai"
// import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

// export const runtime: ServerRuntime = "edge"

// export async function POST(request: Request) {
//   const json = await request.json()
//   const { chatSettings, messages } = json as {
//     chatSettings: ChatSettings
//     messages: any[]
//   }

//   try {
//     const profile = await getServerProfile()

//     checkApiKey(profile.openai_api_key, "OpenAI")

//     const openai = new OpenAI({
//       apiKey: "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",
//       organization: "proj_2jGjoviTulOtQDw07AezwJXI"
//     })

//     const response = await openai.chat.completions.create({
//       model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
//       messages: messages as ChatCompletionCreateParamsBase["messages"],
//       temperature: chatSettings.temperature,
//       max_tokens:
//         chatSettings.model === "gpt-3.5-turbo"
//         // ||
//         // chatSettings.model === "gpt-4o"
//           ? 4096
//           : null, // TODO: Fix
//       stream: true
//     })

//     const stream = OpenAIStream(response)

//     return new StreamingTextResponse(stream)
//   } catch (error: any) {
//     let errorMessage = error.message || "An unexpected error occurred"
//     const errorCode = error.status || 500

//     if (errorMessage.toLowerCase().includes("api key not found")) {
//       errorMessage =
//         "OpenAI API Key not found. Please set it in your profile settings."
//     } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
//       errorMessage =
//         "OpenAI API Key is incorrect. Please fix it in your profile settings."
//     }

//     return new Response(JSON.stringify({ message: errorMessage }), {
//       status: errorCode
//     })
//   }
// }

// import { OpenAIStream, StreamingTextResponse } from "ai"
// import { ServerRuntime } from "next"
// import OpenAI from "openai"
// import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

// export const runtime: ServerRuntime = "edge"

// export async function POST(request: Request) {
//   const json = await request.json()
//   const { chatSettings, messages } = json as {
//     chatSettings: ChatSettings
//     messages: any[]
//   }

//   try {
//     // ✅ جلب مفتاح API و Organization ID من المتغيرات البيئية
//     const apiKey = process.env.OPENAI_API_KEY
//     const organization = process.env.OPENAI_ORG_ID

//     if (!apiKey) {
//       throw new Error("OpenAI API Key is missing. Please set it in your .env.local file.")
//     }

//     const openai = new OpenAI({
//       apiKey,
//       organization
//     })

//     // ✅ ضبط النموذج ليكون خاصًا بالاستشارات القانونية السعودية
//     const systemMessage = {
//       role: "system",
//       content: "أنت مستشار قانوني متخصص في القوانين السعودية. تجيب فقط على الأسئلة القانونية المتعلقة بالمملكة العربية السعودية."
//     }

//     const formattedMessages = [systemMessage, ...messages] as ChatCompletionCreateParamsBase["messages"]

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: formattedMessages,
//       temperature: 0, // ✅ جعل الإجابات دقيقة وغير عشوائية
//       max_tokens: 2048,
//       // chatSettings.model === "gpt-3.5-turbo" ? 2048 : 4096, // ✅ تحسين التحكم بعدد الكلمات
//       stream: true
//     })

//     const stream = OpenAIStream(response)
//     return new StreamingTextResponse(stream)

//   } catch (error: any) {
//     let errorMessage = error.message || "An unexpected error occurred"
//     const errorCode = error.status || 500

//     if (errorMessage.toLowerCase().includes("api key is missing")) {
//       errorMessage = "مفتاح OpenAI API غير موجود. الرجاء إضافته في ملف .env.local"
//     } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
//       errorMessage = "مفتاح OpenAI API غير صحيح. الرجاء التحقق من صحته."
//     }

//     return new Response(JSON.stringify({ message: errorMessage }), {
//       status: errorCode,
//     })
//   }
// }

import {
  checkApiKey,
  getServerProfile,
} from "@/lib/server/server-chat-helpers";
import { ChatSettings } from "@/types";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ServerRuntime } from "next";
import OpenAI from "openai";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

export const runtime: ServerRuntime = "edge";

export async function POST(request: Request) {
  const json = await request.json();
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings;
    messages: any[];
  };

  try {
    const profile = await getServerProfile();

    // checkApiKey(profile.openrouter_api_key, "OpenRouter")

    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || "",
      baseURL: "https://openrouter.ai/api/v1",
    });

    const systemMessage = {
      role: "system",
      content:
        "أنت LawgicAI – مستشارك القانوني الذكي، متخصص في تقديم الاستشارات القانونية المتعلقة بالقوانين والأنظمة السعودية فقط. يجب أن تكون إجاباتك دقيقة، مختصرة، وواضحة، وتعتمد على المصادر القانونية الرسمية. لا تجب على أي أسئلة خارج نطاق القانون السعودي، ولا تقدم آراء شخصية أو استشارات تتطلب تدخل محامٍ متخصص.",
    };

    const formattedMessages = [
      systemMessage,
      ...messages,
    ] as ChatCompletionCreateParamsBase["messages"];

    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      // chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: formattedMessages,
      //messages as ChatCompletionCreateParamsBase["messages"],
      temperature: 0,
      //chatSettings.temperature,
      max_tokens: undefined,
      stream: true,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenRouter API Key not found. Please set it in your profile settings.";
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
