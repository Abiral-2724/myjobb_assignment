import { Home, Package, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">myjobb AI</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/products" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
              <Package size={20} />
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}