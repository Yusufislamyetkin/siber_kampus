# SİBER KAMPÜS — DURUM NOTU (2026-06-06)

## TAMAMLANAN İŞLER

### Faz 0 — Flag Düzeltmeleri ✅
- 8 adet client/server flag uyumsuzluğu düzeltildi (app-auth.jsx)
- Makale sayfası blank page sorunu çözüldü

### Faz 1 — Legacy Web Odaları Golden Standard Yükseltmesi ✅
Aşağıdaki 8 oda two-panel golden standard mimarisine yükseltildi:

| Oda     | Konu                  | Durum |
|---------|----------------------|-------|
| web-02  | UNION SQL Injection   | ✅ Yeniden yazıldı |
| web-03  | Blind SQL Injection   | ✅ Yeniden yazıldı |
| web-04  | XSS (Reflected)       | ✅ Yeniden yazıldı |
| web-05  | XSS (Stored & DOM)    | ✅ Yeniden yazıldı |
| web-06  | CSRF Saldırıları      | ✅ Yeniden yazıldı |
| web-07  | File Upload Bypass    | ✅ Yeniden yazıldı |
| web-08  | SSRF & XXE            | ✅ Yeniden yazıldı |
| web-09  | JWT Token Exploitation| ✅ Yeniden yazıldı |

- **Compile**: Başarılı — 303.3kb (app-auth.js)
- **Cache version**: v=1.0.22 (index.html'de hem preload hem script tag)

### Zaten Golden Standard Olan Odalar (dokunulmadı)
- web-01, web-11, web-12, web-13, web-14, web-15, net-01

## TEST DURUMU
- ✅ Vercel deploy başarılı (prod) — site: https://www.siberkampus.org
- ✅ Esbuild derleme başarılı — 303.3kb, syntax hatası yok
- ⚠️ SPA routing sorunu: Vercel'de `/room/web-03` gibi deep link'ler 404 veriyor
  - **Çözüm**: `vercel.json` dosyasına rewrite kuralı eklenmeli:
    ```json
    { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
    ```
  - Bu eklenmeden canlı sitede direct URL ile oda açılamaz (SPA client-side routing)
- ⚠️ Oda testleri: SPA içinden navigate ederek (dashboard → kategori → oda) test edilmeli
- ⚠️ Login gerekli — Claude credential giremez, kullanıcı manuel giriş yapmalı
- Preview (localhost:3000) da aynı DB sorunu var — token doğrulaması /api/me başarısız

## KALAN İŞLER (Öncelik Sırasıyla)

### Faz 1.5 — web-10 Capstone ⏳
- Mevcut terminal arayüzüne sağ panel (ADIM ADIM REHBER) eklenmeli
- En büyük rewrite — terminale two-panel wrapper gerekiyor
- Satır: ~2186 civarı app-auth.jsx

### Faz 2 — Net Odaları (net-02 ~ net-10) ⏳
- 9 oda sıfırdan yazılacak
- Şu an fallback handler ile flag bedavaya veriliyor
- Her birine golden standard two-panel arayüz lazım
- Konular: Wireshark, ARP Spoof, DNS Poison, MITM, Port Scan, Firewall Bypass, Lateral Move, WiFi Crack, Net Capstone

### Faz 3 — Sys Odaları (sys-01 ~ sys-10) ⏳
- SysTerminalSim component var (~satır 2777), çalışıyor
- İhtiyaç: Two-panel wrapper eklemek (sol=terminal, sağ=rehber)
- 10 oda

### Faz 4 — Makaleler ⏳
- Tüm odalar tamamlandıktan sonra yazılacak
- Mevcut makaleler: net-01, web-01, web-04, web-11, web-12, web-13 (sk-articles.jsx)
- Kalan 29 oda için makale yazılması gerekiyor

## TEKNİK NOTLAR
- Build komutu: `npx esbuild app-auth.jsx --outfile=app-auth.js --minify --jsx=transform --format=iife`
- Tüm dosyalar: `npm run compile`
- Her batch edit sonrası cache version bump gerekiyor (index.html)
- Golden standard pattern: Sol panel (1.1fr, beyaz, 420px) + Sağ panel (1.9fr, koyu, tab'lı)
- Step machine: stepXDone boolean'ları, Kilitli→Aktif→Tamamlandı
- run() dönüş değerleri: {ok: true/false/'warn'/'info', msg: '...'}
