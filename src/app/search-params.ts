// Note: import from 'nuqs/server' to avoid the "use client" directive
import {
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
  SORT_DELIMITER,
} from "@/lib/delimiters";
import {
  createParser,
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  parseAsTimestamp,
  type inferParserType,
} from "nuqs/server";

export const parseAsSort = createParser({
  parse(queryValue) {
    const [id, desc] = queryValue.split(SORT_DELIMITER);
    if (!id && !desc) return null;
    return { id, desc: desc === "desc" };
  },
  serialize(value) {
    return `${value.id}.${value.desc ? "desc" : "asc"}`;
  },
});

export const searchParamsParser = {
  // SEARCH
  search: parseAsString,

  // COLUMN FILTERS
  id: parseAsString,
  name: parseAsString,
  bio: parseAsString,
  language: parseAsString,
  version: parseAsArrayOf(parseAsInteger, SLIDER_DELIMITER),
  state: parseAsString,
  createdDate: parseAsArrayOf(parseAsTimestamp, RANGE_DELIMITER),

  // SORTING & PAGINATION
  sort: parseAsSort,
  size: parseAsInteger.withDefault(20),
  start: parseAsInteger.withDefault(0),

  // INFINITE SCROLLING
  direction: parseAsStringLiteral(["prev", "next"]).withDefault("next"),
  cursor: parseAsTimestamp.withDefault(new Date()),
  live: parseAsBoolean.withDefault(false),

  // SELECTION
  uuid: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParser);

export const searchParamsSerializer = createSerializer(searchParamsParser);

export type SearchParamsType = inferParserType<typeof searchParamsParser>;
