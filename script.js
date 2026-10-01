const clients = [
  { name: "Veolia", logo: "/images/clients/veolia-removebg-preview.webp", url: "https://veolia.com" },
  { name: "Les Crous", logo: "/images/clients/crous-removebg-preview.webp", url: "https://www.crous.fr" },
  { name: "BoursoBank", logo: "/images/clients/boursobank-removebg-preview.webp", url: "https://www.boursobank.com" },
  { name: "SNCF", logo: "/images/clients/sncf-removebg-preview.webp", url: "https://sncf.com" },
  { name: "Jamel Comedy Club", logo: "/images/clients/jamel-comedy-club-removebg-preview.webp", url: null },
  { name: "Pathé", logo: "/images/clients/pathe-removebg-preview.webp", url: "https://pathe.com" },
  { name: "Epitech", logo: "/images/clients/epitech.svg", url: "https://epitech.eu" }
];

// Bandeau "Ils nous font confiance" (page d'accueil uniquement) : no-op sur
// les autres pages, qui n'ont pas de #clientsTrack.
function renderClientsBand() {
  const track = document.getElementById('clientsTrack');
  if (!track) return;

  function buildGroup() {
    const group = document.createElement('div');
    group.className = 'clients-group';

    clients.forEach((client) => {
      const wrap = document.createElement('span');
      wrap.className = 'clients-logo-link';

      const img = document.createElement('img');
      img.src = client.logo;
      img.alt = client.name;
      img.className = 'clients-logo';
      img.loading = 'lazy';
      img.onerror = () => {
        // Le fichier logo n'existe pas encore (images/clients/ à compléter) :
        // on affiche le nom du client plutôt qu'une icône d'image cassée.
        const fallback = document.createElement('span');
        fallback.className = 'clients-logo-fallback';
        fallback.textContent = client.name;
        wrap.replaceChild(fallback, img);
      };

      wrap.appendChild(img);
      group.appendChild(wrap);
    });

    return group;
  }

  // Le contenu est dupliqué : l'animation translate(-50%) boucle ainsi de
  // façon parfaitement continue, sans saut visible.
  track.appendChild(buildGroup());
  track.appendChild(buildGroup());

  // Mobile : pause du défilement tant que le doigt est posé (:active n'est
  // pas fiable au toucher, d'où la classe).
  track.addEventListener('touchstart', () => track.classList.add('is-paused'), { passive: true });
  ['touchend', 'touchcancel'].forEach((type) => {
    track.addEventListener(type, () => track.classList.remove('is-paused'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    const updateHeaderState = () => {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  renderClientsBand();
  // iOS Safari n'applique :active au toucher que si un listener touchstart existe.
  document.addEventListener('touchstart', () => {}, { passive: true });
});
