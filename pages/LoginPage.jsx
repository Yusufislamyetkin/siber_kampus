import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Tüm alanları doldurunuz.');
      return;
    }
    // Başarı
    setError('');
    navigate('home');
  };

  return (
    <>
      <Header navigate={navigate} />

      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#eafff5] mb-3">Giriş Yap</h1>
            <p className="text-[#74998a]">siberkampus hesabına erişim sağla</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[rgba(255,107,107,.1)] border border-[#ff6b6b] rounded-lg p-4">
                <p className="text-sm text-[#ff6b6b]">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#cdeede] mb-2">E-posta Adresi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#07150e] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors"
                placeholder="seni@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cdeede] mb-2">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#07150e] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 accent-[#00ff88]" />
                <span className="text-[#74998a]">Beni hatırla</span>
              </label>
              <a href="#" className="text-[#00ff88] hover:text-[#5cffba] transition-colors">Şifremi Unuttum?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00ff88] text-[#021008] py-3 font-bold rounded-lg hover:shadow-[0_0_28px_-4px_rgba(0,255,136,.55)] transition-all"
            >
              Giriş Yap
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#0c2719]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#020806] text-[#74998a]">veya</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <button className="w-full border border-[#103a26] text-[#cdeede] py-3 rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-medium">
              Google ile Giriş Yap
            </button>
            <button className="w-full border border-[#103a26] text-[#cdeede] py-3 rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-medium">
              GitHub ile Giriş Yap
            </button>
          </div>

          <p className="text-center text-[#74998a] text-sm">
            Hesabın yok mu?{' '}
            <button
              onClick={() => navigate('register')}
              className="text-[#00ff88] hover:text-[#5cffba] transition-colors font-medium"
            >
              Kayıt Ol
            </button>
          </p>
        </div>
      </section>

      <Footer navigate={navigate} />
    </>
  );
};

export default LoginPage;
