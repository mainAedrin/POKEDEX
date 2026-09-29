import Type, { TYPE_TRANSLATIONS } from './type.js';

export default class Pokemon {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.hp = data.stats.HP;
    this.attack = data.stats.attack;
    this.defense = data.stats.defense;
    this.special_attack = data.stats.special_attack;
    this.speed = data.stats.speed;

    this.apiTypes = data.types.map((typeName) => new Type(typeName));
  }

  displayCard() {
    const article = document.createElement('article');

    const primaryType = this.apiTypes[0];
    const primaryColor = primaryType ? primaryType.color : 'grey';

    const typesHtml = this.apiTypes
      .map(
        (type) =>
          `<span class="types" style="background-color: ${type.color}">${
            TYPE_TRANSLATIONS[type.name] || type.name
          }</span>`
      )
      .join('');

    article.innerHTML = `
      <figure>
        <picture style="background-color: ${primaryColor}">
          <img src="${this.image}" alt="Image ${this.name}" />
        </picture>
        <figcaption>
          <div class="types-container">${typesHtml}</div>
          <h2>${this.name}</h2>
          <ol>
            <li>Points de vie : ${this.hp}</li>
            <li>Attaque : ${this.attack}</li>
            <li>Défense : ${this.defense}</li>
            <li>Attaque spécial : ${this.special_attack}</li>
            <li>Vitesse : ${this.speed}</li>
          </ol>
        </figcaption>
      </figure>`;

    article.style.borderColor = primaryColor;
    return article;
  }
}