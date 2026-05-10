import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/style.css';

import { setupHttpInterceptors } from './lib/http/interceptors';
import { App } from './App';

setupHttpInterceptors();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
