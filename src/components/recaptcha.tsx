'use client';

import { useEffect } from 'react';

export default function Recaptcha({ onVerify }: { onVerify: (token: string) => void }) {
  useEffect(() => {
    const handleLoad = async () => {
      try {
        // Load reCAPTCHA script
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          // @ts-ignore
          window.grecaptcha.ready(() => {
            // @ts-ignore
            window.grecaptcha.execute(
              process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, 
              { action: 'submit' }
            ).then(onVerify);
          });
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error('reCAPTCHA load error:', error);
      }
    };

    handleLoad();

    return () => {
      // Cleanup if needed
    };
  }, [onVerify]);

  return null;
}