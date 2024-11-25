'use client';

import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push(redirectTo);
          router.refresh();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [redirectTo, router, supabase.auth]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-400">
            Sign in to your account to continue
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3B82F6',
                  brandAccent: '#2563EB',
                  inputBackground: '#1F2937',
                  inputText: 'white',
                  inputPlaceholder: '#9CA3AF',
                  inputBorder: '#374151',
                  dividerBackground: '#374151',
                },
              },
            },
            className: {
              container: 'w-full',
              button: 'bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg transition-colors',
              input: 'bg-gray-700 text-white border-gray-600 w-full py-2 px-3 rounded-lg',
              label: 'text-white',
              message: 'text-red-500',
            },
          }}
          theme="dark"
          providers={[]}
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`}
          onlyThirdPartyProviders={false}
          magicLink={false}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign In',
                loading_button_label: 'Signing In...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign Up',
                loading_button_label: 'Signing Up...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: 'Don\'t have an account? Sign up',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
