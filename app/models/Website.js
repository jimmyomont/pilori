import validator from "validator";
import slugify from "slugify";

class Website {

  #title;
  #description;
  #address;
  #device;
  #level;

  constructor(config) {
    this.title = config.title;
    this.description = config.description;
    this.address = config.address;
    this.device = config.device;
    this.level = config.level;
  }

  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get address() {
    return this.#address;
  }

  get device() {
    return this.#device;
  }

  get level() {
    return this.#level;
  }

  get slug() {
    return slugify(this.title, {
      lower: true,
      strict: true,
    });
  }

  set title(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Titre incorrect');
    }
    this.#title = value.trim();
  }

  set description(value) {
    this.#description = value;
  }

  set address(value) {
    if (!validator.isURL(value)) {
      throw new Error('Adresse incorrecte');
    }
    this.#address = value;
  }

  set device(value) {
    const allowedValues = ['Mobile', 'Ordinateur', 'Lecteur d\'écran'];
    if (typeof value !== 'undefined' && !allowedValues.includes(value)) {
      throw new Error(`3 valeurs autorisées : ${allowedValues.join(', ')}`);
    }
    this.#device = value;
  }

  set level(value) {
    const allowedValues = ['Bloquant', 'Gênant', 'Casse-tête'];
    if (typeof value !== 'undefined' && !allowedValues.includes(value)) {
      throw new Error(`3 valeurs autorisées : ${allowedValues.join(', ')}`);
    }
    this.#level = value;
  }

}

export default Website;
