import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RoomsPage = ({ navigate }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const rooms = [
    { id: 1, name: 'Web Exploitation Lab', difficulty: 'Başlangıç', desc: 'SQL Injection ve XSS saldırılarını öğren', users: 2340 },
    { id: 2, name: 'Linux Privilege Escalation', difficulty: 'Orta', desc: 'Sistem erişimleri ve yükseltme teknikleri', users: 1890 },
    { id: 3, name: 'Network Penetration Testing', difficulty: 'Ileri', desc: 'Ağ zafiyetleri ve sızma testi', users: 1230 },
    { id: 4, name: 'Reverse Engineering Challenge', difficulty: 'Uzman', desc: 'İkili dosyaları analiz et ve tersine mühendislik yap', users: 650 },
    { id: 5, name: 'Cryptography Basics', difficulty: 'Başlangıç', desc: 'Şifreleme algoritmaları ve anahtarlar', users: 2100 },
    { id: 6, name: 'Malware Analysis Lab', difficulty: 'Ileri', desc: 'Zararlı yazılım incelemesi ve davranış analizi', users: 980 },
    { id: 7, name: 'Social Engineering Simulation', difficulty: 'Orta', desc: 'Phishing ve sosyal mühendislik saldırıları', users: 1540 },
    { id: 8, name: 'Cloud Security Challenge', difficulty: 'Ileri', desc: 'AWS, Azure ve Google Cloud güvenliği', users: 890 },
    { id: 9, name: 'Forensic Investigation', difficulty: 'Uzman', desc: 'Dijital adli bilişim ve kanıt analizi', users: 450 },
    { id: 10, name: 'IoT & Embedded Systems Hacking', difficulty: 'Uzman', desc: 'IoT cihazları ve gömülü sistemlerin güvenliği', users: 380 }
  ];

  const difficultyColors = {
    'Başlangıç': 'text-[#5cffba]',
    'Orta': 'text-[#ffd166]',
    'Ileri': 'text-[#ff6b6b]',
    'Uzman': 'text-[#ff2e88]'
  };

  const difficultyBg = {
    'Başlangıç': 'bg-[rgba(92,255,186,.1)]',
    'Orta': 'bg-[rgba(255,209,102,.1)]',
    'Ileri': 'bg-[rgba(255,107,107,.1)]',
    'Uzman': 'bg-[rgba(255,46,136,.1)]'
  };

  return (
    <>
      <Header navigate={navigate} />

      <section className="py-20 border-b border-[#0c2719]">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-xs tracking-widest text-[#00ff88] uppercase mb-4">// Laboratuvarlar</p>
          <h1 className="text-5xl font-bold text-[#eafff5] mb-6">Hacking Laboratuvarları</h1>
          <p className="text-[#74998a] max-w-2xl">10 adet uygulamalı laboratuvarla sıfırdan uzman seviyesine kadar çıkmanı sağlayacak görevler. Her laboratuvar kendi başına bağımsız ve seçtiğin zorluk seviyesinde başlayabilirsin.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className="bg-gradient-to-br from-[#07150e] to-[#04100a] border border-[#0c2719] rounded-xl p-8 hover:border-[#00ff88] hover:shadow-[0_24px_50px_-28px_rgba(0,255,136,.35)] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#eafff5] group-hover:text-[#00ff88] transition-colors mb-2">{room.name}</h2>
                    <p className="text-sm text-[#74998a]">{room.desc}</p>
                  </div>
                  <div className={`text-xs font-bold px-3 py-1.5 rounded ${difficultyColors[room.difficulty]} ${difficultyBg[room.difficulty]}`}>
                    {room.difficulty}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#0c2719]">
                  <span className="text-xs text-[#3d564b]">👥 {room.users.toLocaleString('tr-TR')} katılımcı</span>
                  <span className="text-xs text-[#3d564b] group-hover:text-[#00ff88] transition-colors">Başla →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#020806] border border-[#103a26] rounded-xl max-w-xl w-full p-10">
            <h2 className="text-3xl font-bold text-[#eafff5] mb-4">{selectedRoom.name}</h2>
            <p className="text-[#74998a] mb-6">{selectedRoom.desc}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-[#07150e] border border-[#0c2719] rounded-lg">
                <span className="text-sm text-[#74998a]">Zorluk Seviyesi</span>
                <span className={`font-bold ${difficultyColors[selectedRoom.difficulty]}`}>{selectedRoom.difficulty}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#07150e] border border-[#0c2719] rounded-lg">
                <span className="text-sm text-[#74998a]">Katılımcı Sayısı</span>
                <span className="font-bold text-[#eafff5]">{selectedRoom.users.toLocaleString('tr-TR')}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-[#00ff88] text-[#021008] px-6 py-3 font-bold text-sm rounded-none hover:shadow-[0_0_28px_-4px_rgba(0,255,136,.55)] transition-all"
                style={{clipPath: 'polygon(0 0,100% 0,100% 70%,calc(100% - 12px) 100%,0 100%)'}}>
                Laboratuvarı Aç
              </button>
              <button
                onClick={() => setSelectedRoom(null)}
                className="flex-1 border border-[#103a26] text-[#cdeede] px-6 py-3 text-sm hover:border-[#00ff88] hover:text-[#00ff88] transition-colors rounded-lg"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer navigate={navigate} />
    </>
  );
};

export default RoomsPage;
