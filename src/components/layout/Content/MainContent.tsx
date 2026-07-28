import React from 'react';
import { Outlet } from 'react-router-dom';

interface MainContentProps {
  children?: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
      {children ?? <Outlet />}
    </main>
  );
};

export default MainContent;
