'use client'
import { Home, Package, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed lg:static
        top-0 left-0 h-full
        w-64 bg-gray-900 text-white
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
       
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Assignment</h2>
        </div>
        
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)} 
              >
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/products" 
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)} 
              >
                <Package size={20} />
                <span>Products</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          
        </div>
      </div>
    </>
  );
}