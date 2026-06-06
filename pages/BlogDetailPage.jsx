import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogDetailPage = ({ blog, navigate }) => {
  if (!blog) {
    return (
      <>
        <Header navigate={navigate} />
        <div className="py-20 text-center">
          <p className="text-[#74998a]">Makale bulunamadı.</p>
        </div>
        <Footer navigate={navigate} />
      </>
    );
  }

  const relatedPosts = [
    { id: 2, title: 'Reverse Shell Teknikleri', category: 'Post-Exploitation' },
    { id: 3, title: 'Linux Privilege Escalation', category: 'Privilege Escalation' },
    { id: 4, title: 'Phishing Kampanyaları', category: 'Sosyal Mühendislik' }
  ];

  return (
    <>
      <Header navigate={navigate} />

      <article className="py-20">
        <div className="max-w-3xl mx-auto px-8">
          <button
            onClick={() => navigate('blogs')}
            className="text-[#00ff88] hover:text-[#5cffba] transition-colors text-sm mb-8 flex items-center gap-2"
          >
            ← Tüm Makalelere Dön
          </button>

          <header className="mb-12">
            <span className="text-xs text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-2.5 py-1 rounded-full">{blog.category}</span>
            <h1 className="text-5xl font-bold text-[#eafff5] my-6">{blog.title}</h1>
            <div className="flex items-center gap-6 text-sm text-[#74998a]">
              <span>{blog.author}</span>
              <span>•</span>
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
            </div>
          </header>

          <div className="prose prose-invert max-w-none mb-16">
            <p className="text-[#74998a] text-lg leading-relaxed mb-8">
              {blog.excerpt}
            </p>

            <div className="bg-[#07150e] border border-[#103a26] rounded-lg p-8 my-8">
              <p className="text-[#5cffba] font-mono text-sm leading-relaxed">
                // Bu makale siberkampus'ta bulunan laboratuvarlarla uyumludur.<br />
                // Öğrendiklerini hemen uygulamak için platformu ziyaret et.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-[#eafff5] mt-12 mb-6">Giriş</h2>
            <p className="text-[#74998a] leading-relaxed mb-6">
              Siber güvenlik alanındaki bu konu, saldırganların en sık kullandığı tekniklerden biridir. Sistemi korumak için bu saldırıların nasıl çalıştığını anlamak kritiktir. Bu makalede, teorik bilgilerle beraber gerçek örnekler üzerinden gideceğiz.
            </p>

            <h2 className="text-3xl font-bold text-[#eafff5] mt-12 mb-6">Temel Kavramlar</h2>
            <p className="text-[#74998a] leading-relaxed mb-6">
              Başlamadan önce bazı temel kavramları anlamak önemlidir. Bu konular, ileri seviye saldırıları anlamanın da temeli oluşturur. Her bir bileşeni dikkatli inceleyerek ilerleyin.
            </p>

            <h2 className="text-3xl font-bold text-[#eafff5] mt-12 mb-6">Pratik Uygulamalar</h2>
            <p className="text-[#74998a] leading-relaxed mb-6">
              Siberkampus'ta bulunan laboratuvarlar, bu makalede anlatılan tekniklerin gerçek ortamda uygulanmasını sağlar. Her laboratuvar, adım adım rehberler ve ipuçlarıyla dolu. Zorluk seviyelerini ise kendi hızında ilerleyerek belirleyebilirsin.
            </p>

            <div className="bg-[#0a1d13] border border-[#103a26] rounded-lg p-8 my-8">
              <h3 className="text-[#00ff88] font-bold mb-4">💡 İpucu</h3>
              <p className="text-[#74998a] text-sm">
                Bu konuyla ilgili CTF görevlerini çözerken, her adımı not almanız ve mantık akışını anlamanız önerilir. Kod yazarken ya da komut çalıştırırken daima hedefin ne olduğunu sorgulamanız güvenlik farkındalığını artıracaktır.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-[#eafff5] mt-12 mb-6">Sonuç</h2>
            <p className="text-[#74998a] leading-relaxed">
              Bu makale, siber güvenlik yolculuğunun başında veya ilerlemesinde sana rehberlik etmesi için yazılmıştır. Öğrendiğin bilgiler sadece teorik değil, pratik uygulamalarla desteklenmiştir. Unutma: siber güvenlik bir yolculuktur, hedef ise bu alanda uzman olmaktır.
            </p>
          </div>

          <div className="border-t border-[#0c2719] pt-12 mb-16">
            <h3 className="text-2xl font-bold text-[#eafff5] mb-8">İlgili Makaleler</h3>
            <div className="grid grid-cols-1 gap-4">
              {relatedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate('blog-detail', post)}
                  className="bg-[#07150e] border border-[#0c2719] rounded-lg p-6 hover:border-[#00ff88] hover:bg-[#0a1d13] transition-all cursor-pointer group"
                >
                  <span className="text-xs text-[#5cffba] border border-[#103a26] bg-[rgba(0,255,136,.04)] px-2.5 py-1 rounded-full">{post.category}</span>
                  <h4 className="text-lg font-bold text-[#eafff5] my-3 group-hover:text-[#00ff88] transition-colors">{post.title}</h4>
                  <span className="text-xs text-[#3d564b] group-hover:text-[#00ff88] transition-colors">Oku →</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#07150e] to-[#04100a] border border-[#103a26] rounded-xl p-10 text-center">
            <h3 className="text-2xl font-bold text-[#eafff5] mb-4">Bu Konuyu Pratik Yapmak İster misin?</h3>
            <p className="text-[#74998a] mb-6 max-w-2xl mx-auto">
              Siberkampus'ta bu makaleyle ilgili laboratuvarlar ve CTF görevleri seni bekliyor. Hemen başla ve gerçek bir sistem üzerinde çalışarak öğren.
            </p>
            <button
              onClick={() => navigate('home')}
              className="bg-[#00ff88] text-[#021008] px-7 py-3 font-bold text-sm rounded-none hover:shadow-[0_0_28px_-4px_rgba(0,255,136,.55)] transition-all"
              style={{clipPath: 'polygon(0 0,100% 0,100% 70%,calc(100% - 12px) 100%,0 100%)'}}
            >
              Laboratuvarları Gör →
            </button>
          </div>
        </div>
      </article>

      <Footer navigate={navigate} />
    </>
  );
};

export default BlogDetailPage;
