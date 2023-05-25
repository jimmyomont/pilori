import validator from 'validator';
import bcrypt from 'bcrypt';
import User from "../models/User.js";

export const users = [];

const authController = {
  
  login: function(req, res) {
    res.render('login');
  },
  
  loginAction: function(req, res) {
    try {
      const foundUser = users.find(user => user.email === req.body.email);
      if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.hash, function(err, result) {
          if (result) {
            req.session.isLogged = true;
            // on a fait le choix de ne stocker que l'email en session
            // on sera à même de trouver les infos de l'utilisateur dans la liste à partir de ça
            req.session.userEmail = foundUser.email; 
            res.redirect('/profil');
          }
          else {
            res.render('login', { alert: 'Mauvais couple identifiant/mot de passe' });
          }
        });
      }
      else {
        throw new Error('Mauvais couple identifiant/mot de passe');
      }
    } catch (error) {
      res.render('login', { alert: error.message });
    }
  },
  
  signup: function(req, res) {
    res.render('register');
  },
  
  signupAction: function(req, res) {
    // on crée un hash
    bcrypt.hash(req.body.password, 10, (error, hash) => {
      try {
        // on vérifie que le mot de passe est assez robuste
        const options = { minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 };
        if (!validator.isStrongPassword(req.body.password, options)) {
          throw new Error('Le mot de passe doit comporter au moins 12 caractères et au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial');
        }
        // c'est le hash qu'on mémorisera dans notre objet user après
        req.body.hash = hash;
        // on crée un utilisateur
        const user = new User(req.body);
        // on le mémorise dans la liste
        users.push(user);
        // Possibilité 1 : l'utilsateur doit se connecter 
        // res.redirect('/connexion');
        // Possibilité 2 : l'utilisateur est connecté dès son inscription
        // on le mémorise dans la session
        req.session.isLogged = true;
        req.session.userEmail = user.email;
        // on l'emmene sur son profil 
        res.redirect('/profil');
      } catch (error) {
        res.render('register', { alert: error.message });
      }
    });
  },
  
  logout: function(req, res) {
    // pour se déconnecter il faut vider la session
    // méthode 1 :
    // req.session.isLogged = false;
    // req.session.userEmail = null;
    // méthode 2 :
    req.session.destroy();
    res.redirect('/');
  },

};

export default authController;
