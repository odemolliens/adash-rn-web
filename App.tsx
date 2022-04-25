import { AppContextProvider } from './src/contexts/AppContext';
import Dashboard from './src/Dashboard';

export default function App() {
  setTimeout(() => {
    document.head.insertAdjacentHTML(
      'beforeend',
      `<style>iframe {display:none !important}</style>`
    );
  }, 100);
  return (
    <AppContextProvider>
      <Dashboard />
    </AppContextProvider>
  );
}
