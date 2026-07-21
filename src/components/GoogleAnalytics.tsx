import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// O ID deve ser passado via variável de ambiente VITE_GA_ID no arquivo .env
export const GA_TRACKING_ID = import.meta.env.VITE_GA_ID;

// Declaração para o TypeScript reconhecer o gtag no window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export default function GoogleAnalytics() {
  const location = useLocation();

  // Inicializa o Google Analytics apenas uma vez
  useEffect(() => {
    if (!GA_TRACKING_ID) return;

    // Evita carregar o script múltiplas vezes
    if (document.getElementById('google-analytics-script')) return;

    const script = document.createElement('script');
    script.id = 'google-analytics-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    const initScript = document.createElement('script');
    initScript.id = 'google-analytics-init';
    initScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}', {
        page_path: window.location.pathname,
      });
    `;
    document.head.appendChild(initScript);
  }, []);

  // Rastreia mudanças de rota (page views do React Router)
  useEffect(() => {
    if (GA_TRACKING_ID) {
      pageview(location.pathname + location.search);
    }
  }, [location]);

  return null;
}
