import "dotenv/config";
import * as z from "zod";

const createEnv = () => {
  const envSchema = z.object({
    PORT: z.string().optional().default("3001"),
    JWT_PRIVATE_KEY: z.string(),
    NODE_ENV: z.enum(["development", "production"]),
  });

  const envVars = Object.entries(process.env).reduce<Record<string, string>>(
    (acc, curr) => {
      const [key, value] = curr;
      acc[key] = value as string;
      return acc;
    },
    {}
  );
  const parsedEnv = envSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
        The following variables are missing or invalid:
        ${Object.entries(parsedEnv.error.flatten().fieldErrors)
          .map(([k, v]) => `- ${k}: ${v}`)
          .join("\n")}
        `
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
