import websites from "../data/websites.js";
import Website from "../models/Website.js";

const websiteController = {

  all: function(req, res) {
    // si une recherche est faite
    if (req.query.keywords) {
      const filteredWebsites = websites.filter(website => website.title.includes(req.query.keywords));
      // et qu'elle donne lieu à des résultats
      if (filteredWebsites.length > 0) {
        res.render('list', {
          title: 'Résultat de la recherche',
          websites: filteredWebsites,
        });
      }
      // ou aucun résultat
      else {
        res.render('list', {
          title: 'Aucun résultat',
          websites: filteredWebsites,
        });
      }
    }
    // ou pas de recherche -> toute la liste
    else {
      res.render('list', {
        title: 'Toutes les tomates',
        websites,
      });
    }
  },

  form: function(req, res) {
    res.render('add-site');
  },

  formAction: function(req, res) {
    try {
      const website = new Website(req.body);
      websites.push(website);
      res.redirect('/tomates/' + website.slug);
    } catch (error) {
      res.render('add-site', {
        message: error.message,
      });
    }
  },

  details: function(req, res, next) {
    const foundWebsite = websites.find(website => website.slug === req.params.slug);
    if (!foundWebsite) {
      next();
    }
    else {
      res.render('detail', {
        website: foundWebsite,
      });
    }
  },

};

export default websiteController;
