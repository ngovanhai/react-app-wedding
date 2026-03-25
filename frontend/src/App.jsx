import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import UploadPage from './pages/UploadPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import InfoFormPage from './pages/InfoFormPage';
import AlbumViewPage from './pages/AlbumViewPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/select-template" element={<TemplateSelectionPage />} />
          <Route path="/info-form" element={<InfoFormPage />} />
          <Route path="/album/:shareCode" element={<AlbumViewPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;