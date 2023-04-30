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
  "MCMP",
  "ES2",
  "ES3",
  "ES5",
  "VM1",
  "VM2",
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
  card: { holo, name, serialNumber, directImageLink },
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
    directImageLink,
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
  holo?: boolean;
  serialNumber: number;
  directImageLink?: string;
  mightBeToExpensive?: number;
}
export type PokemonCardCollection = PokemonCard[];
export type EditionRecord = Record<EditionLiteral, PokemonCardCollection>;

function editionRecordLength(editionRecord: EditionRecord) {
  const initialAccumulator: Pick<WishlistInformation, "holo" | "total"> = {
    holo: 0,
    total: 0,
  };

  return editionCollection.reduce((acc, edition) => {
    const cardCollection = editionRecord[edition];

    return {
      ...acc,
      holo: acc.holo + cardCollection.filter((card) => card.holo).length,
      total: acc.total + cardCollection.length,
    };
  }, initialAccumulator);
}

interface WishlistInformation {
  holo: number;
  total: number;
}
interface AllWhistlistInformation {
  paul: WishlistInformation;
  hugo: WishlistInformation;
  allWishlist: EditionRecord;
}
function mergeWhishList(): AllWhistlistInformation {
  const initialAccumulator: EditionRecord = {
    ES2: [],
    ES3: [],
    ES5: [],
    MCMP: [],
    MCVS5: [],
    NEO2: [],
    NEO3: [],
    NEO4: [],
    OR5: [],
    OR6: [],
    SOIS: [],
    UPC: [],
    VM3: [],
    VS: [],
    VM1: [],
    VM2: [],
  };
  const allWishlist = editionCollection.reduce((accumulator, edition) => {
    return {
      ...accumulator,
      [edition]: [...HUGO_WHISHLIST[edition], ...PAUL_WISTLIST[edition]].sort(
        (a, b) => a.serialNumber - b.serialNumber
      ),
    };
  }, initialAccumulator);

  const hugo = editionRecordLength(HUGO_WHISHLIST);
  const paul = editionRecordLength(PAUL_WISTLIST);

  return {
    allWishlist,
    hugo,
    paul,
  };
}

export const AllWhistlistInformation = mergeWhishList();
