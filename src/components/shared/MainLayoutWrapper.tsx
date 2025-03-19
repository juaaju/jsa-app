import React, { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import ChatBot from '../ChatBot/ChatBot';

interface MainLayoutWrapperProps {
  children: ReactNode;
}

export default function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Layout />}>
          {/* Outlet dari Layout akan merender children di sini */}
          <Route index element={<>{children}</>} />
          {/* Anda bisa menambahkan route lain di sini */}
        </Route>
      </Routes>
      
      {/* ChatBot di luar Routes agar tetap visible di semua halaman */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatBot />
      </div>
    </>
  );
}