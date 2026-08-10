import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router';

import CreatorPage from '../features/creator/pages/CreatorPage';
import ViewerPage from '../features/viewer/pages/ViewerPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/creator" replace />}
        />

        <Route
          path="/creator"
          element={<CreatorPage />}
        />

        <Route
          path="/viewer/:sessionId"
          element={<ViewerPage />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;