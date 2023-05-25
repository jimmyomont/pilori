import Website from '../models/Website.js';

const websites = [
  new Website({
    title: 'Oclock.io',
    description: "Il y a un gros problème. Je constate de très gros soucis pour naviguer et c'est impossible d'utiliser correctement tous les boutons à disposition.",
    address: 'https://oclock.io/',
    device: 'Mobile',
    level: 'Bloquant',
  }), 
  new Website({
    title: 'NPM',
    address: 'https://www.npmjs.com/',
  }), 
  new Website({
    title: 'Google',
    description: 'Il y a un tout petit problème.',
    address: 'https://www.google.com/',
    device: 'Ordinateur',
    level: 'Casse-tête',
  }), 
  new Website({
    title: 'Wikipédia',
    description: "C'est pas jojo",
    address: 'https://fr.wikipedia.org/',
    device: 'Mobile',
    level: 'Bloquant',
  }),
  new Website({
    title: 'Facebook',
    description: "C'est nul",
    address: 'https://facebook.com/',
    device: 'Mobile',
    level: 'Bloquant',
  }),
];

export default websites;
