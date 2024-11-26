import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

export const createClient = () => {
  return createClientComponentClient<Database>({
    cookieOptions: {
      name: 'sb-auth-token',
      maxAge: 60 * 60 * 8,
      domain: '',
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  });
};
