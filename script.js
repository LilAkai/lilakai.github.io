// Met à jour l'année dans le footer automatiquement, plutôt que de
// l'écrire en dur et devoir y penser chaque nouvelle année
document.getElementById('year').textContent = new Date().getFullYear();

// ------------------------------------------------------------------
// Âge calculé automatiquement — se met à jour tout seul chaque année,
// pas besoin de retoucher le site à chaque anniversaire.
// ------------------------------------------------------------------

// Mois en JS vont de 0 (janvier) à 11 (décembre), d'où le "- 1" sur le mois.
const BIRTH_DATE = new Date(2006, 10 - 1, 1); // 01/10/2006

function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  // On vérifie si l'anniversaire de cette année est déjà passé ou non :
  // si le mois actuel est avant le mois de naissance, ou si on est dans
  // le même mois mais avant le jour de naissance, l'anniversaire n'a
  // pas encore eu lieu cette année => on retire 1 an.
  const anniversairePasseCetteAnnee =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!anniversairePasseCetteAnnee) {
    age--;
  }

  return age;
}

const ageElement = document.getElementById('age');
if (ageElement) {
  ageElement.textContent = calculateAge(BIRTH_DATE);
}

// ------------------------------------------------------------------
// Traduction FR / EN
//
// Principe : chaque élément traduisible porte un attribut
// data-i18n="une.cle" dans le HTML. Ce dictionnaire fait correspondre
// chaque clé à son texte dans chaque langue. Changer de langue revient
// juste à reparcourir tous les éléments data-i18n et à remplacer leur
// contenu par la bonne valeur — pas besoin de dupliquer le site.
// ------------------------------------------------------------------

const translations = {
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.projects': 'Projets',
    'nav.skills': 'Compétences',
    'nav.contact': 'Contact',
    'nav.openMenu': 'Ouvrir le menu',
    'hero.kicker': '👋 Salut, je suis',
    'hero.subtitle': `Développeur passionné — je construis des jeux, des outils et des
        expériences en <span class="highlight">C</span>,
        <span class="highlight">C++</span>,
        <span class="highlight">Java</span> et
        <span class="highlight">Swift</span>.`,
    'hero.cta1': 'Voir mes projets',
    'hero.cta2': 'Me contacter',
    'hero.scrollDown': 'Défiler vers le bas',
    'about.title': 'À propos',
    'about.text1': 'Je suis un jeune développeur de',
    'about.text2': "ans, je suis passionné depuis mon plus jeune âge. Je cherche constamment à améliorer et approfondir mes connaissances.",
    'projects.title': 'Projets',
    'projects.subtitle': "Une sélection de ce sur quoi j'ai travaillé récemment.",
    'project.ant.desc': 'Ce projet est une simulation lightweight de fourmis',
    'project.ariba.desc': 'POO ECS Engine en C++',
    'project.sourceLink': 'Code source →',
    'skills.title': 'Compétences',
    'contact.title': 'Discutons',
    'contact.subtitle': "Un projet en tête, une question, ou juste envie d'échanger ? Écris-moi.",
    'contact.emailBtn': '✉ Envoyer un email',
    'footer.built': 'construit avec HTML &amp; CSS.',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'nav.openMenu': 'Open menu',
    'hero.kicker': "👋 Hi, I'm",
    'hero.subtitle': `Passionate developer — I build games, tools and
        experiences in <span class="highlight">C</span>,
        <span class="highlight">C++</span>,
        <span class="highlight">Java</span> and
        <span class="highlight">Swift</span>.`,
    'hero.cta1': 'See my projects',
    'hero.cta2': 'Contact me',
    'hero.scrollDown': 'Scroll down',
    'about.title': 'About',
    'about.text1': "I'm a young developer,",
    'about.text2': "years old, and I've been passionate about coding since I was young. I'm always looking to improve and deepen my knowledge.",
    'projects.title': 'Projects',
    'projects.subtitle': "A selection of what I've been working on recently.",
    'project.ant.desc': 'A lightweight ant simulation project',
    'project.ariba.desc': 'OOP ECS engine written in C++',
    'project.sourceLink': 'Source code →',
    'skills.title': 'Skills',
    'contact.title': "Let's talk",
    'contact.subtitle': 'Got a project in mind, a question, or just want to say hi? Reach out.',
    'contact.emailBtn': '✉ Send an email',
    'footer.built': 'built with HTML &amp; CSS.',
  },
};

const langToggle = document.getElementById('lang-toggle');
const panelToggleBtn = document.getElementById('panel-toggle');
const scrollHint = document.getElementById('scroll-hint');

function applyLanguage(lang) {
  const dict = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  // aria-label ne peut pas être ciblé par data-i18n (ce n'est pas du texte
  // visible), donc on le met à jour "à la main" ici.
  panelToggleBtn.setAttribute('aria-label', dict['nav.openMenu']);
  scrollHint.setAttribute('aria-label', dict['hero.scrollDown']);

  document.documentElement.lang = lang;
  // Le bouton affiche la langue vers laquelle on BASCULERA au clic,
  // donc l'inverse de la langue actuellement affichée.
  langToggle.textContent = lang === 'fr' ? 'EN' : 'FR';

  localStorage.setItem('lang', lang);
}

langToggle.addEventListener('click', () => {
  const current = document.documentElement.lang === 'fr' ? 'en' : 'fr';
  applyLanguage(current);
});

// Au chargement : on reprend la langue choisie précédemment (si le
// visiteur revient sur le site), sinon on reste en français par défaut.
const savedLang = localStorage.getItem('lang');
if (savedLang === 'en') {
  applyLanguage('en');
}

// On respecte le réglage système "réduire les animations" : les effets
// ci-dessous (halo curseur, apparitions au scroll) sont purement
// décoratifs, donc on les désactive entièrement pour ces visiteurs.
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// ------------------------------------------------------------------
// Panneau latéral (tiroir de navigation) + sous-menu "Projets"
// ------------------------------------------------------------------
const panelToggle = document.getElementById('panel-toggle');
const sidePanel = document.getElementById('side-panel');
const sidePanelOverlay = document.getElementById('side-panel-overlay');
const sidePanelClose = document.getElementById('side-panel-close');
const submenuToggle = document.getElementById('side-submenu-toggle');
const submenu = document.getElementById('side-submenu');

function openPanel() {
  sidePanel.classList.add('open');
  sidePanelOverlay.classList.add('visible');
  panelToggle.setAttribute('aria-expanded', 'true');
  sidePanel.setAttribute('aria-hidden', 'false');
  // Empêche la page de défiler derrière le panneau pendant qu'il est ouvert
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  sidePanel.classList.remove('open');
  sidePanelOverlay.classList.remove('visible');
  panelToggle.setAttribute('aria-expanded', 'false');
  sidePanel.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

panelToggle.addEventListener('click', () => {
  const isOpen = sidePanel.classList.contains('open');
  isOpen ? closePanel() : openPanel();
});

sidePanelClose.addEventListener('click', closePanel);
sidePanelOverlay.addEventListener('click', closePanel);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && sidePanel.classList.contains('open')) {
    closePanel();
  }
});

// Sous-menu "Projets" : s'ouvre/se ferme indépendamment du panneau
submenuToggle.addEventListener('click', () => {
  const isOpen = submenu.classList.toggle('open');
  submenuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Cliquer sur un lien (y compris un lien de projet dans le sous-menu)
// referme le panneau, pour qu'on retrouve directement la section visée.
sidePanel.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closePanel);
});

// ------------------------------------------------------------------
// Nav qui "se matérialise" au scroll
//
// Transparente sur le premier écran (le hero), elle devient un
// panneau de verre dès qu'on quitte le haut de la page — comportement
// identique à la vraie barre de navigation d'apple.com.
// ------------------------------------------------------------------
const navEl = document.getElementById('nav');

function updateNavOnScroll() {
  navEl.classList.toggle('scrolled', window.scrollY > 40);
}

updateNavOnScroll(); // état correct si la page est rouverte déjà scrollée
window.addEventListener('scroll', updateNavOnScroll, { passive: true });

if (!prefersReducedMotion) {
  // --------------------------------------------------------------
  // Halo qui suit le curseur sur les cartes projets
  //
  // À chaque déplacement de la souris sur une carte, on calcule sa
  // position en pourcentage (0-100%) par rapport aux bords de la
  // carte, et on la stocke dans deux variables CSS (--mx, --my) que
  // le dégradé radial de .project-card::before utilise pour se
  // positionner. Résultat : la lumière semble traverser le verre
  // exactement là où pointe la souris.
  // --------------------------------------------------------------
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  // --------------------------------------------------------------
  // Apparitions au scroll
  //
  // On ajoute la classe "reveal" (définie en CSS : élément flou et
  // transparent) aux blocs qu'on veut animer, puis un
  // IntersectionObserver ajoute "in-view" dès que chacun entre dans
  // le viewport — l'élément devient alors net et opaque. Un léger
  // décalage (transitionDelay) selon la position dans son groupe
  // donne un effet d'apparition en cascade plutôt que tout d'un coup.
  // --------------------------------------------------------------
  const revealGroups = [
    document.querySelectorAll('.hero-kicker, .hero-title, .hero-subtitle, .hero-actions'),
    document.querySelectorAll('.about .section-title, .about-text'),
    document.querySelectorAll('.projects .section-title, .projects .section-subtitle'),
    document.querySelectorAll('.project-card'),
    document.querySelectorAll('.skills .section-title'),
    document.querySelectorAll('.skill-pill'),
    document.querySelectorAll('.contact .section-title, .contact .section-subtitle, .contact-links'),
  ];

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealGroups.forEach(group => {
    group.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 6) * 0.08}s`;
      observer.observe(el);
    });
  });
}