import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">Wedding Album</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="text-gray-600 hover:text-pink-600">Home</a></li>
              <li><a href="/upload" className="text-gray-600 hover:text-pink-600">Create Album</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="bg-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © {new Date().getFullYear()} Wedding Album - Beautiful memories preserved forever
        </div>
      </footer>
    </div>
  );
};

export default Layout;