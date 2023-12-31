import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppThemeProvider } from './shared/contexts/ThemeContext';
import { AppRoutes } from './routes';
import { MenuLateral } from './shared/components';
import { DrawerProvider } from './shared/contexts';

export const App = () => {

  return (
    <AppThemeProvider>
      <DrawerProvider>
        <BrowserRouter>
          <MenuLateral>
            <AppRoutes />
          </MenuLateral>
        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );

};
