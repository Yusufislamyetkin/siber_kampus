import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RegisterPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Tüm alanları doldurunuz.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Şartları ve koşulları kabul etmelisiniz.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.');
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
            <h1 className="text-4xl font-bold text-[#eafff5] mb-3">Kayıt Ol</h1>
            <p className="text-[#74998a]">siberkampus'a katıl ve siber güvenlik uzmanı ol</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-[rgba(255,107,107,.1)] border border-[#ff6b6b] rounded-lg p-4">
                <p className="text-sm text-[#ff6b6b]">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#cdeede] mb-2">Ad Soyad</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#07150e] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors"
                placeholder="Adını Gir"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cdeede] mb-2">E-posta Adresi</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#07150e] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors"
                placeholder="seni@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cdeede] mb-2">Şifre</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#07150e] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-[#3d564b] mt-2">En az 8 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cdeede] mb-2">Şifreyi Onayla</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#07150e] border border-[#103a26] rounded-lg px-4 py-3 text-[#cdeede] placeholder-[#3d564b] focus:border-[#00ff88] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 accent-[#00ff88] mt-1"
              />
              <span className="text-xs text-[#74998a]">
                <a href="#" className="text-[#00ff88] hover:text-[#5cffba]">Kullanım Şartları</a> ve{' '}
                <a href="#" className="text-[#00ff88] hover:text-[#5cffba]">Gizlilik Politikası</a>'nı kabul ediyorum.
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-[#00ff88] text-[#021008] py-3 font-bold rounded-lg hover:shadow-[0_0_28px_-4px_rgba(0,255,136,.55)] transition-all"
            >
              Kayıt Ol
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
              Google ile Kayıt Ol
            </button>
            <button className="w-full border border-[#103a26] text-[#cdeede] py-3 rounded-lg hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-medium">
              GitHub ile Kayıt Ol
            </button>
          </div>

          <p className="text-center text-[#74998a] text-sm">
            Zaten hesabın var mı?{' '}
            <button
              onClick={() => navigate('login')}
              className="text-[#00ff88] hover:text-[#5cffba] transition-colors font-medium"
            >
              Giriş Yap
            </button>
          </p>
        </div>
      </section>

      <Footer navigate={navigate} />
    </>
  );
};

export default RegisterPage;
