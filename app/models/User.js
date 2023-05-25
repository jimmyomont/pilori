import validator from "validator";

class User {
  
  #email;
  #hash;

  constructor(config) {
    this.email = config.email;
    this.hash = config.hash;
  }

  get email() {
    return this.#email;
  }

  get hash() {
    return this.#hash;
  }

  set email(value) {
    if (!validator.isEmail(value)) {
      throw new Error('Email invalide');
    }
    this.#email = value;
  }

  set hash(value) {
    if (!value) {
      throw new Error('Mot de passe invalide');
    }
    this.#hash = value;
  }

}

export default User;