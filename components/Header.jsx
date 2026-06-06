import React from 'react';

const Header = ({ navigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-[rgba(2,8,6,.72)] backdrop-blur-sm border-b border-[#0c2719]">
      <div className="max-w-5xl mx-auto px-8 flex items-center justify-between h-[72px]">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-3 font-bold text-lg text-[#eafff5]"
        >
          <div className="w-8 h-8 border border-[#00ff88] rounded-lg flex items-center justify-center text-[#00ff88] font-mono text-sm font-bold shadow-[0_0_18px_-4px_rgba(0,255,136,.55),inset_0_0_12px_-6px_rgba(0,255,136,.55)]">
            &gt;_
          </div>
          siber<span className="text-[#00ff88]">kampus</span>
        </button>

        <nav className="hidden md:flex gap-9 items-center text-sm">
          <button onClick={() => navigate('home')} className="text-[#74998a] hover:text-[#cdeede] transition-colors relative group">
            Anasayfa
            <div className="absolute left-0 -bottom-2 h-0.5 bg-[#00ff88] w-0 group-hover:w-full transition-all duration-200"></div>
          </button>
          <button onClick={() => navigate('blogs')} className="text-[#74998a] hover:text-[#cdeede] transition-colors relative group">
            Blog
            <div className="absolute left-0 -bottom-2 h-0.5 bg-[#00ff88] w-0 group-hover:w-full transition-all duration-200"></div>
          </button>
          <button onClick={() => navigate('rooms')} className="text-[#74998a] hover:text-[#cdeede] transition-colors relative group">
            Laboratuvarlar
            <div className="absolute left-0 -bottom-2 h-0.5 bg-[#00ff88] w-0 group-hover:w-full transition-all duration-200"></div>
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('login')}
            className="hidden sm:inline-block border border-[#103a26] text-[#cdeede] px-4 py-2.5 text-sm bg-transparent hover:border-[#00ff88] hover:text-[#00ff88] transition-colors"
          >
            Giriş Yap
          </button>
          <button
            onClick={() => navigate('register')}
            className="bg-[#00ff88] text-[#021008] px-5 py-2.5 font-bold text-sm rounded-none hover:shadow-[0_0_28px_-4px_rgba(0,255,136,.55)] transition-all"
            style={{clipPath: 'polygon(0 0,100% 0,100% 70%,calc(100% - 12px) 100%,0 100%)'}}
          >
            Ücretsiz Başla
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
