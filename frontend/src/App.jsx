import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { AuthProvider } from './components/auth/AuthProvider';
import { Toaster } from 'react-hot-toast';
import ContentWrapper from './components/ui/ContentWrapper';

function App() {
  return (
    <AuthProvider>
      <ContentWrapper>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" reverseOrder={false} />
      </ContentWrapper>
    </AuthProvider>
  );
}

export default App;
