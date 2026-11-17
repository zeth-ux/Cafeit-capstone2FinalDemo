import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import CafeDetail from './pages/CafeDetail.jsx';
import Home from './pages/Home.jsx';
import Live from './pages/Live.jsx';
import MyPage from './pages/MyPage.jsx';
import Recommend from './pages/Recommend.jsx';
import Report from './pages/Report.jsx';
import Saved from './pages/Saved.jsx';
import { StoreProvider } from './store.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/cafe/:id" element={<CafeDetail />} />
            <Route path="/live" element={<Live />} />
            <Route path="/live/report" element={<Report />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/me" element={<MyPage />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
);
