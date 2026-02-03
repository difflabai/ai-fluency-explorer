import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z
    .string()
    .url('VITE_SUPABASE_URL must be a valid URL')
    .min(1, 'VITE_SUPABASE_URL is required'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY is required'),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map(
      (issue) => '  - ' + issue.path.join('.') + ': ' + issue.message
    );
    const errors = errorMessages.join('\n');

    console.error('Environment validation failed:\n' + errors);

    if (import.meta.env.DEV) {
      throw new Error(
        'Environment validation failed. Check console for details.\n\n' +
          'Make sure you have a .env file with:\n' +
          '  VITE_SUPABASE_URL=your_supabase_url\n' +
          '  VITE_SUPABASE_ANON_KEY=your_anon_key\n\n' +
          'Errors:\n' +
          errors
      );
    }

    throw new Error('Application configuration error. Please contact support.');
  }

  return parsed.data;
}

export const env = validateEnv();
