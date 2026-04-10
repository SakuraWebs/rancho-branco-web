/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';
import AdminPanel from './components/AdminPanel';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
          </Route>
        </Routes>
        <AdminPanel />
      </BrowserRouter>
    </AuthProvider>
  );
}


