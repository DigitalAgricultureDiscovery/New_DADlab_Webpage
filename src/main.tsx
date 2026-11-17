import {createRoot} from 'react-dom/client';
// Self-hosted, open-licensed (SIL OFL 1.1) web fonts bundled by Vite. They stand in for
// Purdue's licensed brand fonts, which are only licensed for Purdue-owned domains.
// See docs/typography.md.
import '@fontsource-variable/libre-franklin/wght.css';
import '@fontsource-variable/libre-franklin/wght-italic.css';
import '@fontsource/barlow-semi-condensed/600.css';
import '@fontsource/barlow-semi-condensed/700.css';
import '@fontsource-variable/source-serif-4/wght.css';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
