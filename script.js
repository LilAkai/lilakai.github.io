// Menu mobile : on ouvre/ferme la liste de liens en ajoutant/retirant
// la classe "open" (voir style.css, règle .nav-links.open)
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Ferme le menu automatiquement quand on clique sur un lien (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

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
const navToggleBtn = document.getElementById('nav-toggle');
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
  navToggleBtn.setAttribute('aria-label', dict['nav.openMenu']);
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