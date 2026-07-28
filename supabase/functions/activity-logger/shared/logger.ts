/**
 * Structured Logger for Supabase Edge Functions
 */
export const logger = {
  info: (message: string, data?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'INFO', message, data, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, data?: Record<string, any>) => {
    console.warn(JSON.stringify({ level: 'WARN', message, data, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: any) => {
    console.error(
      JSON.stringify({
        level: 'ERROR',
        message,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      })
    );
  },
};
