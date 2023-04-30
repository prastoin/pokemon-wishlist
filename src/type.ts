import { HUGO_WHISHLIST } from "./hugo";
import { PAUL_WISTLIST } from "./paul";

export const editionCollection = [
  "VS",
  "MCVS5",
  "SOIS",
  "UPC",
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
  // Not HD
  // const imageUrl = `https://www.pokecardex.com/assets/images/sets_jp/${edition}/${serialNumber}.jpg`;
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

function mergeWhishList(): EditionRecord {
  const initialAccumulator: EditionRecord = {
    ES2: [],
    ES3: [],
    ES4: [],
    ES5: [],
    MCMP: [],
    MCVS5: [],
    NEO2: [],
    NEO3: [],
    NEO4: [],
    OR5: [],
    OR6: [],
    PRT: [],
    SOIS: [],
    UPC: [],
    VM3: [],
    VS: [],
  };
  return editionCollection.reduce((accumulator, edition) => {
    return {
      ...accumulator,
      [edition]: [...HUGO_WHISHLIST[edition], ...PAUL_WISTLIST[edition]],
    };
  }, initialAccumulator);
}

export const ALL_WISHLIST = mergeWhishList();
