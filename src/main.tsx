import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { HelmetProvider } from 'react-helmet-async';

// The server (api/render.js) injects SEO tags marked data-rh for crawlers.
// React/Helmet renders the same tags again on the client, so remove the server copies first.
document.head
  .querySelectorAll('title, meta[data-rh], link[rel="canonical"][data-rh]')
  .forEach((el) => el.remove());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
