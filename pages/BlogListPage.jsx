import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogListPage = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const blogs = [
    {
      id: 1,
      title: 'SQLi ile Veritabanına Girmek',
      excerpt: 'SQL Injection saldırılarının temelini ve gerçek dünyada nasıl kullanıldığını öğren.',
      category: 'Web Güvenliği',
      date: '15 Mayıs 2025',
      author: 'Ahmet Yılmaz',
      readTime: '8 min'
    },
    {
      id: 2,
      title: 'Reverse Shell ve Backdoor Teknikleri',
      excerpt: 'Sistem ele geçirildikten sonra kalıcı erişim sağlamanın yöntemlerini keşfet.',
      category: 'Post-Exploitation',
      date: '12 Mayıs 2025',
      author: 'Zeynep Kara',
      readTime: '12 min'
    },
    {
      id: 3,
      title: 'Linux Ayrıcalık Yükseltme Rehberi',
      excerpt: 'Sınırlı kullanıcı hesabından root erişimi almak için kullanılan yöntemler.',
      category: 'Privilege Escalation',
      date: '10 Mayıs 2025',
      author: 'Can Demir',
      readTime: '15 min'
    },
    {
      id: 4,
      title: 'Phishing Kampanyalarını Analiz Etmek',
      excerpt: 'Sosyal mühendislik saldırılarının anatomi ve savunma mekanizmaları.',
      category: 'Sosyal Mühendislik',
      date: '8 Mayıs 2025',
      author: 'Fatih Eren',
      readTime: '10 min'
    },
    {
      id: 5,
      title: 'XSS Saldırılarından Korunma',
      excerpt: 'Tarayıcı tabanlı saldırıların çeşitleri ve web uygulamalarını güvenli hale getirme.',
      category: 'Web Güvenliği',
      date: '5 Mayıs 2025',
      author: 'Selin Öz',
      readTime: '9 min'
    },
    {
      id: 6,
      title: 'Kriptografi Temel Kavramları',
      excerpt: 'Şifreleme algoritmaları, anahtarlar ve modern kriptografi yöntemleri.',
      category: 'Kriptografi',
      date: '2 Mayıs 2025',
      author: 'Murat Sönmez',
      readTime: '11 min'
    }
  ];

  const filtered = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header navigate={navigate} />

      <section className="py-20 border-b border-[#0c2719]">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-xs tracking-widest text-[#00ff88] uppercase mb-4">// Blog</p>
          <h1 className="text-5xl font-bold text-[#eafff5] mb-6">Siber Güvenlik Makaleleri</h1>
          <p className="text-[#74998a] max-w-2xl mb-10">Hacking, sızma testi ve siber güvenliğin derinlerine inen yazılar. Alanında uzmanlar tarafından yazılmış en güncel içerikler.</p>

          <div className="relative">
            <input
              type="text"
              placeholder="Makale ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#07150e] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3d564b]">🔍</span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid gap-6">
            {filtered.map((blog) => (
              <article
                key={blog.id}
                onClick={() => navigate('blog-detail', blog)}
                className="bg-gradient-to-br from-[#07150e] to-[#04100a] border border-[#0c2719] rounded-xl p-8 hover:border-[#00ff88] hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-2.5 py-1 rounded-full">{blog.category}</span>
                  </div>
                  <span className="text-xs text-[#3d564b]">{blog.readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#eafff5] mb-3 group-hover:text-[#00ff88] transition-colors">{blog.title}</h2>
                <p className="text-[#74998a] mb-6">{blog.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-[#3d564b]">
                  <div className="flex items-center gap-4">
                    <span>{blog.author}</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>
                  <span className="group-hover:text-[#00ff88] transition-colors">Oku →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </>
  );
};

export default BlogListPage;
