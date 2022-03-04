import { AppContextProvider } from './src/contexts/AppContext';
import Dashboard from './src/Dashboard';

export default function App() {
  return (
    <AppContextProvider>
      <Dashboard />
    </AppContextProvider>
  );
}
