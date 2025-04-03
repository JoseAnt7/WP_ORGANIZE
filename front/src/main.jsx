import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FluxProvider } from './context/FluxContext.jsx';
import App from './App.jsx';
import './index.css';
import { Tester } from './views/test.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Session_Admin } from './views/Session_Admin.jsx';
import { Dashboard } from './views/Dashboard.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FluxProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Session_Admin />} />
          <Route path="/test" element={<Tester />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </FluxProvider>
  </React.StrictMode>
);