export const editionCollection = [
  "VS",
  "MCVS5",
  "SOIS",
  "UPC",
  "PKF",
  "VM3",
  "OR5",
  "OR6",
  "NEO2",
  "NEO3",
  "NEO4",
  "VS",
  "PRT",
  "MCMP",
  "ES2",
  "ES3",
  "ES4",
  "ES5",
] as const;
export type EditionLiteral = (typeof editionCollection)[number];

interface CardPokecardexMetadata {
  imageUrl: string;
  galleryUrl: string;
}

export function parseRawPokemonCardCollection(
  cardCollection: PokemonCardCollection,
  edition: EditionLiteral
): ParsedPokemonCardCollection {
  return cardCollection.map((card) => parseRawPokemonCard({ card, edition }));
}

export function parseRawPokemonCard({
  card: { holo, name, serialNumber },
  edition,
}: {
  card: PokemonCard;
  edition: EditionLiteral;
}): ParsedPokemonCard {
  const { galleryUrl, imageUrl } = getPokecardexUrl({
    edition,
    serialNumber,
  });

  return {
    edition,
    galleryUrl,
    holo,
    imageUrl,
    name,
    serialNumber,
  };
}

export function getPokecardexUrl({
  edition,
  serialNumber,
}: {
  edition: EditionLiteral;
  serialNumber: number;
}): CardPokecardexMetadata {
  const imageUrl = `https://www.pokecardex.com/assets/images/sets_jp/${edition}/HD/${serialNumber}.jpg`;
  const galleryUrl = `https://www.pokecardex.com/series/jp/${edition}#galery-${serialNumber}`;

  return {
    galleryUrl,
    imageUrl,
  };
}
export interface ParsedPokemonCard extends PokemonCard, CardPokecardexMetadata {
  edition: EditionLiteral;
}
export type ParsedPokemonCardCollection = ParsedPokemonCard[];

export interface PokemonCard {
  name: string;
  holo: boolean;
  serialNumber: number;
}
export type PokemonCardCollection = PokemonCard[];
export type EditionRecord = Record<EditionLiteral, PokemonCardCollection>;
