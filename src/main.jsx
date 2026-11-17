import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import CafeDetail from './pages/CafeDetail.jsx';
import Home from './pages/Home.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Live from './pages/Live.jsx';
import MyPage from './pages/MyPage.jsx';
import Recommend from './pages/Recommend.jsx';
import Report from './pages/Report.jsx';
import Saved from './pages/Saved.jsx';
import { StoreProvider } from './store.jsx';
// Self-hosted fonts (no Google Fonts request, works on any network).
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/500.css';
import '@fontsource/noto-sans-kr/600.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/noto-sans-kr/800.css';
import '@fontsource/black-han-sans/400.css';
import '@fontsource/fraunces/600-italic.css';
import '@fontsource/fraunces/700-italic.css';
import '@fontsource/gowun-batang/700.css';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/explore" element={<Home />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/cafe/:id" element={<CafeDetail />} />
            <Route path="/live" element={<Live />} />
            <Route path="/live/report" element={<Report />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/me" element={<MyPage />} />
          </Route>
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
);
