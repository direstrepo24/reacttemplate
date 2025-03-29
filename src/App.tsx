import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from '@core/router/routes';
import { ErrorBoundary } from '@core/error/ErrorBoundary';
import { ThemeProvider } from '@core/theme/ThemeProvider';

const router = createBrowserRouter(routes);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
