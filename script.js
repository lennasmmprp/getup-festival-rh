const clients = [
  { name: "Veolia", logo: "/images/clients/veolia.svg", url: "https://veolia.com" },
  { name: "SNCF", logo: "/images/clients/sncf.svg", url: "https://sncf.com" },
  { name: "Pathé", logo: "/images/clients/pathe.svg", url: "https://pathe.com" },
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
      const wrap = document.createElement(client.url ? 'a' : 'span');
      wrap.className = 'clients-logo-link';
      if (client.url) {
        wrap.href = client.url;
        wrap.target = '_blank';
        wrap.rel = 'noopener';
      }

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
});
