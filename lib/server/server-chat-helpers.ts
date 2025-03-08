import { Database, Tables } from "@/supabase/types";
import { VALID_ENV_KEYS } from "@/types/valid-keys";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getServerProfile() {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    throw new Error("User not found");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    throw new Error("Profile not found");
  }

  const profileWithKeys = addApiKeysToProfile(profile);

  return profileWithKeys;
}

function addApiKeysToProfile(profile: Tables<"profiles">) {
  const apiKeys = {
    [VALID_ENV_KEYS.OPENAI_API_KEY]:
      "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",
    [VALID_ENV_KEYS.ANTHROPIC_API_KEY]: "anthropic_api_key",
    [VALID_ENV_KEYS.GOOGLE_GEMINI_API_KEY]: "google_gemini_api_key",
    [VALID_ENV_KEYS.MISTRAL_API_KEY]: "mistral_api_key",
    [VALID_ENV_KEYS.GROQ_API_KEY]: "groq_api_key",
    [VALID_ENV_KEYS.PERPLEXITY_API_KEY]: "perplexity_api_key",
    [VALID_ENV_KEYS.AZURE_OPENAI_API_KEY]: "azure_openai_api_key",
    [VALID_ENV_KEYS.OPENROUTER_API_KEY]:
      "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",

    [VALID_ENV_KEYS.OPENAI_ORGANIZATION_ID]: "proj_2jGjoviTulOtQDw07AezwJXI",

    [VALID_ENV_KEYS.AZURE_OPENAI_ENDPOINT]: "azure_openai_endpoint",
    [VALID_ENV_KEYS.AZURE_GPT_35_TURBO_NAME]: "azure_openai_35_turbo_id",
    [VALID_ENV_KEYS.AZURE_GPT_45_VISION_NAME]: "azure_openai_45_vision_id",
    [VALID_ENV_KEYS.AZURE_GPT_45_TURBO_NAME]: "azure_openai_45_turbo_id",
    [VALID_ENV_KEYS.AZURE_EMBEDDINGS_NAME]: "azure_openai_embeddings_id",
  };

  for (const [envKey, profileKey] of Object.entries(apiKeys)) {
    if (process.env[envKey]) {
      (profile as any)[profileKey] = process.env[envKey];
    }
  }

  return profile;
}

export function checkApiKey(apiKey: string | null, keyName: string) {
  if (apiKey === null || apiKey === "") {
    throw new Error(`${keyName} API Key not found`);
  }
}
