import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { autoInitializeIfNeeded } from './utils/appInitialization';

// Run auto-initialization check on app startup
if (process.env.NODE_ENV === 'development') {
  autoInitializeIfNeeded().catch(console.error);
}

createRoot(document.getElementById("root")!).render(<App />);
