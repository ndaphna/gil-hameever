'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Hamburger for mobile */}
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
        aria-label="פתח תפריט"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

