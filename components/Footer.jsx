import React from 'react';

const Footer = ({ navigate }) => {
  return (
    <footer className="bg-[#04100a] border-t border-[#0c2719] py-16">
      <div className="max-w-5xl mx-auto px-8">
        <div className="grid grid-cols-4 gap-10 mb-12 pb-12 border-b border-[#0c2719]">
          <div>
            <button onClick={() => navigate('home')} className="flex items-center gap-2 font-bold text-[#eafff5] mb-4">
              <div className="w-8 h-8 border border-[#00ff88] rounded-lg flex items-center justify-center text-[#00ff88] font-mono text-xs font-bold">
                &gt;_
              </div>
              siber<span className="text-[#00ff88]">kampus</span>
            </button>
            <p className="text-[#74998a] text-sm leading-relaxed">Uygulamalı CTF görevleri ve hacking laboratuvarlarıyla yeni nesil siber güvenlik uzmanlarını yetiştiriyoruz.</p>
          </div>

          <div>
            <div className="font-disp font-bold text-xs tracking-widest text-[#74998a] uppercase mb-4">Platform</div>
            <div className="space-y-3">
              <button onClick={() => navigate('rooms')} className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Laboratuvarlar</button>
              <button onClick={() => navigate('blogs')} className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Blog</button>
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">CTF Görevleri</a>
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Liderlik Tablosu</a>
            </div>
          </div>

          <div>
            <div className="font-disp font-bold text-xs tracking-widest text-[#74998a] uppercase mb-4">Kampüs</div>
            <div className="space-y-3">
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Hakkımızda</a>
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Mentörler</a>
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Topluluk</a>
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Kariyer</a>
            </div>
          </div>

          <div>
            <div className="font-disp font-bold text-xs tracking-widest text-[#74998a] uppercase mb-4">İletişim</div>
            <div className="space-y-3">
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Destek</a>
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Kurumsal</a>
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">Gizlilik</a>
              <a href="#" className="block text-[#74998a] text-sm hover:text-[#00ff88] transition-colors">İletişim</a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-[#5c8a74]">© 2026 siberkampus — Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-3 text-sm text-[#74998a]">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]"></span>
            Tüm sistemler çalışıyor
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
