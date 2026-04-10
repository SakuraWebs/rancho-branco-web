/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// atualização forçada.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Casamentos from './pages/Casamentos';
import Eventos from './pages/Eventos';
import Galeria from './pages/Galeria';
import SobreNos from './pages/SobreNos';
import Contato from './pages/Contato';
import Orcamento from './pages/Orcamento';
import PoliticasPrivacidade from './pages/PoliticasPrivacidade';
import TermosUso from './pages/TermosUso';
import MaintenancePage from './pages/MaintenancePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminPanel from './components/AdminPanel';

function AppRoutes() {
  const { user, loading } = useAuth();
  const isAuthorized = user?.email === 'enrique.rfm@gmail.com';

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <Routes>
        <Route path="*" element={<MaintenancePage />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sobre-nos" element={<SobreNos />} />
          <Route path="casamentos" element={<Casamentos />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="galeria" element={<Galeria />} />
          <Route path="contato" element={<Contato />} />
          <Route path="orcamento" element={<Orcamento />} />
          <Route path="politicas-de-privacidade" element={<PoliticasPrivacidade />} />
          <Route path="termos-de-uso" element={<TermosUso />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <AdminPanel />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}


