/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// atualização forçada.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GoogleAnalytics from './components/GoogleAnalytics';
import Home from './pages/Home';
import Casamentos from './pages/Casamentos';
import Eventos from './pages/Eventos';
import TerroirTradicao from './pages/TerroirTradicao';
import TerroirFeedback from './pages/TerroirFeedback';
import TerroirReport from './pages/TerroirReport';
import Galeria from './pages/Galeria';
import SobreNos from './pages/SobreNos';
import Contato from './pages/Contato';
import Orcamento from './pages/Orcamento';
import PoliticasPrivacidade from './pages/PoliticasPrivacidade';
import TermosUso from './pages/TermosUso';
import MaintenancePage from './pages/MaintenancePage';
import NotFound from './pages/NotFound';
import Agenda from './pages/Agenda';
import AgendaInterna from './pages/AgendaInterna';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminPanel from './components/AdminPanel';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
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
          <Route path="eventos/terroir-e-tradicao" element={<TerroirTradicao />} />
          <Route path="eventos/terroir-e-tradicao/feedback" element={<TerroirFeedback />} />
          <Route path="eventos/terroir-e-tradicao/relatorio" element={<TerroirReport />} />
          <Route path="galeria" element={<Galeria />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="contato" element={<Contato />} />
          <Route path="orcamento" element={<Orcamento />} />
          <Route path="agenda-interna" element={<AgendaInterna />} />
          <Route path="politicas-de-privacidade" element={<PoliticasPrivacidade />} />
          <Route path="termos-de-uso" element={<TermosUso />} />
          <Route path="*" element={<NotFound />} />
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
        <GoogleAnalytics />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}


