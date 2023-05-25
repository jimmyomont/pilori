import websites from "../data/websites.js";

const mainController = {

  home: function(req, res) {
    const firstValues = websites.slice(0, 3);
    res.render('home', {
      websites: firstValues,
    });
  },

  legals: function(req, res) {
    res.render('coming-soon', {
      title: 'Mentions légales',
    });
  },

  plan: function(req, res) {
    res.render('coming-soon', {
      title: 'Plan du site',
    });
  },

  contact: function(req, res) {
    res.render('coming-soon', {
      title: 'Contact',
    });
  },

  notFound: function(req, res) {
    res.status(404).render('error', {
      message: 'La page demandée n\'a pas été trouvée.',
    });
  }

};

export default mainController;
