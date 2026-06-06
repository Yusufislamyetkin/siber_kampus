const fs = require('fs');
const vm = require('vm');

// Mock browser globals
const windowMock = {
  location: { pathname: '/' },
  history: { pushState: () => {}, replaceState: () => {} },
  addEventListener: () => {},
  dispatchEvent: () => {},
  scrollTo: () => {},
  localStorage: {
    getItem: (key) => {
      if (key === 'sk_token') return 'mock_token';
      return null;
    },
    setItem: () => {},
    removeItem: () => {}
  }
};

const ReactMock = {
  useState: (val) => [val, () => {}],
  useRef: () => ({ current: null }),
  useEffect: () => {},
  useMemo: (fn) => fn(),
  createElement: () => ({}),
  Fragment: 'Fragment'
};

const ReactDOMMock = {
  createRoot: () => ({
    render: () => {}
  })
};

const context = {
  window: windowMock,
  document: {
    title: '',
    head: { appendChild: () => {} },
    getElementById: () => ({}),
    createElement: () => ({})
  },
  React: ReactMock,
  ReactDOM: ReactDOMMock,
  localStorage: windowMock.localStorage,
  console: console,
  setTimeout: setTimeout,
  setInterval: setInterval
};

vm.createContext(context);

try {
  console.log('Loading sk-data.js...');
  const dataCode = fs.readFileSync('sk-data.js', 'utf8');
  vm.runInContext(dataCode, context, { filename: 'sk-data.js' });

  console.log('Loading sk-articles.js...');
  const articlesCode = fs.readFileSync('sk-articles.js', 'utf8');
  vm.runInContext(articlesCode, context, { filename: 'sk-articles.js' });

  console.log('Loading app.js...');
  const appCode = fs.readFileSync('app.js', 'utf8');
  vm.runInContext(appCode, context, { filename: 'app.js' });

  console.log('Loading app-auth.js...');
  const authCode = fs.readFileSync('app-auth.js', 'utf8');
  vm.runInContext(authCode, context, { filename: 'app-auth.js' });

  console.log('Loading app-pages.js...');
  const pagesCode = fs.readFileSync('app-pages.js', 'utf8');
  vm.runInContext(pagesCode, context, { filename: 'app-pages.js' });

  console.log('Success! No load-time errors found.');
  console.log('Registered PAGES keys:', Object.keys(context.window.__SK_PAGES || {}));
} catch (err) {
  console.error('Error during execution:', err);
}
