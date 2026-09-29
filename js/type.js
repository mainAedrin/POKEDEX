export const TYPE_TRANSLATIONS = {
  normal: 'Normal',
  fire: 'Feu',
  water: 'Eau',
  grass: 'Plante',
  electric: 'Électrik',
  ice: 'Glace',
  fighting: 'Combat',
  poison: 'Poison',
  ground: 'Sol',
  flying: 'Vol',
  psychic: 'Psy',
  bug: 'Insecte',
  rock: 'Roche',
  ghost: 'Spectre',
  dragon: 'Dragon',
  dark: 'Ténèbres',
  steel: 'Acier',
  fairy: 'Fée',
  stellar: 'Stellaire'
};

export default class Type {
  constructor(name, image = '') {
    this.name = name;
    this.image = image;
    this.color = this.getColorHexa();
  }

  getColorHexa() {
    const colors = {
      grass: '#006F14',
      fire: '#D97706',
      water: '#0000CD',
      normal: '#8A8A59',
      electric: '#D0A000',
      ice: '#40B5AD',
      fighting: '#9B0000',
      poison: '#8B008B',
      ground: '#B8652A',
      flying: '#4A69BB',
      psychic: '#D81B60',
      bug: '#558B2F',
      rock: '#9E8A2B',
      ghost: '#512DA8',
      dragon: '#1565C0',
      dark: '#4E342E',
      steel: '#37474F',
      fairy: '#C2185B',
      stellar: '#00838F'
    };
    return colors[this.name.toLowerCase()] || '#666666';
  }
}