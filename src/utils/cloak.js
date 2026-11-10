export const CLOAK_PRESETS = {
  default: {
    title: 'Dizzy Unblocked - Fast Browser Games',
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>'
  },
  classroom: {
    title: 'Classes - Google Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  docs: {
    title: 'Biology Notes Q3 - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  canvas: {
    title: 'Dashboard · Canvas LMS',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  wikipedia: {
    title: 'Polynomial interpolation - Wikipedia',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
  }
};

export function applyTabCloak(preset) {
  const config = CLOAK_PRESETS[preset] || CLOAK_PRESETS.default;
  document.title = config.title;

  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = config.favicon;
}

export function openAboutBlank(gameUrl, title) {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Pop-up was blocked. Please allow popups to open cloaked games in about:blank.');
    return;
  }
  win.document.title = title || 'Google Classroom';
  const iframe = win.document.createElement('iframe');
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.margin = '0';
  iframe.style.padding = '0';
  iframe.style.overflow = 'hidden';
  iframe.src = window.location.origin + gameUrl;
  win.document.body.style.margin = '0';
  win.document.body.style.overflow = 'hidden';
  win.document.body.appendChild(iframe);
}
