import { users } from '../controllers/authController.js';

const userController = {
  
  profil: function(req, res) {
    const user = users.find(element => element.email === req.session.userEmail);
    res.render('profil', { user }); // passer user n'est pas nécessairement utile car je l'ai déjà fait dans le middleware addUserData
  },

};

export default userController;
