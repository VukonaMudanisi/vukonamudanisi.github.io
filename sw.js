const CACHE_NAME = 'vukona-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/projects.html',
  '/contact.html',
  '/styles.css',
  '/script.js',
  '/contact.php',
  '/manifest.json',
  '/assets/profile.jpg',
  '/assets/project.svg',
  '/assets/Vukona_Mudanisi_cv.pdf',
  '/assets/transcript.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});