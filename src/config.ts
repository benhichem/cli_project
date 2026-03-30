function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

export const config = {
  telegramToken: requireEnv("TELEGRAM_BOT_TOKEN"),
  ownerTelegramId: parseInt(requireEnv("OWNER_TELEGRAM_ID"), 10),
  port: parseInt(process.env["PORT"] ?? "3000", 10),
  dbPath: process.env["DB_PATH"] ?? "./data/bot.db",
  gemini_api_key: requireEnv("GEMINI_API_KEY"),
};
