import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Import CSS from the source folder for development
import '../../src/styles/gantt.css';

// Render the demo app
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
