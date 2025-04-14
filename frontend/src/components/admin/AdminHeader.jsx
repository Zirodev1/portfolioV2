import PropTypes from 'prop-types';

const AdminHeader = ({ title, toggleSidebar }) => {
  // This would come from authentication in a real implementation
  const adminUser = {
    name: 'Lee Acevedo',
    avatar: 'https://via.placeholder.com/40'
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="mr-4 text-gray-400 hover:text-white lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-4">
            <button className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          
          <div className="flex items-center">
            <img 
              src={adminUser.avatar} 
              alt={adminUser.name} 
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-gray-300">{adminUser.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

AdminHeader.propTypes = {
  title: PropTypes.string.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};

export default AdminHeader;