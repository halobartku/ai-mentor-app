import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '../../theme/ThemeContext';
import { AuthProvider } from '../auth/AuthProvider';
import { store } from '../../store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
