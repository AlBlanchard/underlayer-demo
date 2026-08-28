import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import AdminPage from '@/features/admin/pages/AdminPage';
import DemoPage from '@/features/demo/pages/DemoPage';
import NotFoundPage from '@/pages/NotFoundPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route path="/admin" element={<AdminPage />} />

        <Route path="/demo/:sessionId" element={<DemoPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
