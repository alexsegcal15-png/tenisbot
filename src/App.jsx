import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Access from '@/pages/Access';
import Dashboard from '@/pages/Dashboard';
import Layout from '@/components/Layout';
import AuthGate from '@/components/AuthGate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/access" element={<Access />} />
        <Route element={<AuthGate />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Access />} />
      </Routes>
    </Router>
  );
}

export default App;
