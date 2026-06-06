const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\Yusuf\\Downloads\\siber kampüs(1)';

function updateFile(filename, replacerFn) {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  content = replacerFn(content);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filename}`);
}

// 1. Update index.html
updateFile('index.html', (content) => {
  return content.replace('--dim:#3d564b;', '--dim:#5c8a74;');
});

// 2. Update Footer.jsx
updateFile('components/Footer.jsx', (content) => {
  // Replace text-[#3d564b]
  content = content.replace(/text-\[\#3d564b\]/g, 'text-[#5c8a74]');
  
  // Replace h4 headings with div
  content = content.replace(
    /<h4 className="font-mono text-xs tracking-widest text-\[\#5c8a74\] uppercase mb-4 font-medium">(.*?)<\/h4>/g,
    '<div className="font-disp font-bold text-xs tracking-widest text-[#74998a] uppercase mb-4">$1</div>'
  );
  
  return content;
});

// 3. Update app.jsx
updateFile('app.jsx', (content) => {
  // Replace text-[#3d564b]
  content = content.replace(/text-\[\#3d564b\]/g, 'text-[#5c8a74]');
  
  // Mobile hamburger menu toggle button aria-label
  content = content.replace(
    'className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 border border-[#103a26] rounded bg-[#04100a] transition-all"',
    'aria-label="Mobil Menüyü Aç/Kapat" className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 border border-[#103a26] rounded bg-[#04100a] transition-all"'
  );
  
  // Chatbot submit button aria-label
  content = content.replace(
    'className="w-10 flex-none grid place-items-center font-bold text-[#021008] bg-[#00ff88] rounded-lg hover:shadow-[0_0_20px_-4px_var(--glow)] transition-all">↑</button>',
    'aria-label="Mesaj Gönder" className="w-10 flex-none grid place-items-center font-bold text-[#021008] bg-[#00ff88] rounded-lg hover:shadow-[0_0_20px_-4px_var(--glow)] transition-all">↑</button>'
  );
  
  // Chatbot launcher button aria-label
  content = content.replace(
    'className="ml-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00ff88] text-[#021008] shadow-[0_10px_30px_-6px_var(--glow)] hover:scale-105 transition-transform relative"',
    'aria-label="Destek Sohbetini Aç/Kapat" className="ml-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00ff88] text-[#021008] shadow-[0_10px_30px_-6px_var(--glow)] hover:scale-105 transition-transform relative"'
  );
  
  // Chatbot close button aria-label
  content = content.replace(
    'className="w-7 h-7 grid place-items-center rounded-lg text-[#74998a] hover:text-[#eafff5] hover:bg-white/5 transition-colors text-lg">×</button>',
    'aria-label="Kapat" className="w-7 h-7 grid place-items-center rounded-lg text-[#74998a] hover:text-[#eafff5] hover:bg-white/5 transition-colors text-lg">×</button>'
  );

  // Footer h4 to div
  content = content.replace(
    '<h4 className="font-mono text-xs tracking-[.16em] uppercase text-[#5c8a74] mb-[18px] font-medium">{col.h}</h4>',
    '<div className="font-disp font-bold text-xs tracking-widest text-[#74998a] uppercase mb-[18px]">{col.h}</div>'
  );

  // Heading level fixes in app.jsx
  content = content.replace(
    '<h4 className="font-disp text-[16.5px] text-[#eafff5] mb-1">{r.h}</h4>',
    '<h3 className="font-disp text-[16.5px] text-[#eafff5] mb-1">{r.h}</h3>'
  );
  
  content = content.replace(
    '<h3 className="text-2xl text-[#eafff5] mb-8">İlgili Makaleler</h3>',
    '<h2 className="text-2xl text-[#eafff5] mb-8">İlgili Makaleler</h2>'
  );
  
  content = content.replace(
    '<h4 className="text-lg text-[#eafff5] my-3 group-hover:text-[#00ff88] transition-colors">{p.title}</h4>',
    '<h3 className="text-lg text-[#eafff5] my-3 group-hover:text-[#00ff88] transition-colors">{p.title}</h3>'
  );
  
  content = content.replace(
    '<h3 className="text-2xl text-[#eafff5] mb-4">Bu Konuyu Pratik Yapmak İster misin?</h3>',
    '<h2 className="text-2xl text-[#eafff5] mb-4">Bu Konuyu Pratik Yapmak İster misin?</h2>'
  );

  return content;
});

// 4. Update app-auth.jsx
updateFile('app-auth.jsx', (content) => {
  // Replace text-[#3d564b]
  content = content.replace(/text-\[\#3d564b\]/g, 'text-[#5c8a74]');
  
  // Mobile hamburger menu toggle button aria-label
  content = content.replace(
    'className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 border border-[#103a26] rounded bg-[#04100a] transition-all"',
    'aria-label="Mobil Menüyü Aç/Kapat" className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 border border-[#103a26] rounded bg-[#04100a] transition-all"'
  );
  
  // User profile dropdown button aria-label
  content = content.replace(
    'className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg border border-[#103a26] hover:border-[#00ff88] transition-colors"',
    'aria-label="Kullanıcı Menüsü" className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg border border-[#103a26] hover:border-[#00ff88] transition-colors"'
  );
  
  // Breadcrumb span to h1
  content = content.replace(
    '<span className="text-[#eafff5] font-mono">{config.title}</span>',
    '<h1 className="text-[#eafff5] font-mono inline text-sm md:text-base font-normal">{config.title}</h1>'
  );

  return content;
});

// 5. Update app-pages.jsx
updateFile('app-pages.jsx', (content) => {
  // Replace text-[#3d564b]
  content = content.replace(/text-\[\#3d564b\]/g, 'text-[#5c8a74]');
  return content;
});

console.log('Optimization script completed successfully!');
