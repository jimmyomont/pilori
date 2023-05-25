import { users } from '../controllers/authController.js';

function addUserData(req, res, next) {
  if (req.session.isLogged) {
    // on range dans locals ce qui doit être accessible dans toutes les vues
    res.locals.isLogged = true;
    // on va se servir uniquement de isLogged, mais pour l'exemple on pourrait aussi mettre à dispo les données de l'utilisateur
    res.locals.user = users.find(element => element.email === req.session.userEmail);
  }
  else {
    res.locals.isLogged = false;
    res.locals.user = null;
  }
  next();
}

export default addUserData;