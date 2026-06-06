import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import RoomsPage from './pages/RoomsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const navigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedBlog(data);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#020806] text-[#cdeede] font-mono min-h-screen overflow-x-hidden">
      {/* Global scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-[60] opacity-50 mix-blend-multiply"
        style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,.18) 3px, transparent 4px)'}} />

      {currentPage === 'home' && <HomePage navigate={navigate} />}
      {currentPage === 'blogs' && <BlogListPage navigate={navigate} />}
      {currentPage === 'blog-detail' && <BlogDetailPage blog={selectedBlog} navigate={navigate} />}
      {currentPage === 'rooms' && <RoomsPage navigate={navigate} />}
      {currentPage === 'login' && <LoginPage navigate={navigate} />}
      {currentPage === 'register' && <RegisterPage navigate={navigate} />}
    </div>
  );
};

export default App;
