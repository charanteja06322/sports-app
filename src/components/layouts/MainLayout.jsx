import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

/**
 * MainLayout Component
 * Main layout wrapper for most pages
 */
export const MainLayout = ({ children, className = '' }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main className={`flex-1 py-8 ${className}`}>
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

/**
 * DashboardLayout Component
 * Layout for dashboard pages with sidebar
 */
export const DashboardLayout = ({ children, sidebar, className = '' }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <div className="flex flex-1">
        {sidebar && (
          <aside className="hidden md:block w-64 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
            {sidebar}
          </aside>
        )}
        <main className={`flex-1 py-8 ${className}`}>
          <div className="container">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

/**
 * AuthLayout Component
 * Minimal layout for auth pages
 */
export const AuthLayout = ({ children, className = '' }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-900 dark:to-slate-800">
      <main className={`flex-1 flex items-center justify-center py-8 ${className}`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
