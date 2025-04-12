import { useState } from 'react';
import PropTypes from 'prop-types';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, title = "Admin Dashboard", activeMenu = "dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader toggleSidebar={toggleSidebar} title={title} />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activeMenu={activeMenu} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  activeMenu: PropTypes.string
};

export default AdminLayout; 