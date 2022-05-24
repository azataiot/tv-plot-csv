import { makeRequest } from "./utils.js";
import groups from "/data/instrument-groups.json";
import metadata from "/data/instrument-meta-data.json";

// return all symbol_types from dukascopy instrument groups json file
export async function getSymbolTypes() {
  //   console.log(groups);
  const symbols_types = groups.map((obj) => {
    return {
      name: obj.id,
      value: obj.id,
    };
  });
  return symbols_types;
}

export function getSymboltype(symbol) {
  //   if (appConfig.debug)
  //     console.log("[getSymboltype] method call for symbol", symbol);
  const finded = groups.filter((row) => row.instruments.includes(symbol));
  //   console.log("[getSymboltype] finded symbol type for symbol", finded);
  return finded.length > 0 ? finded[0].id : "others";
}

// return and construct all available symbols for tradingview charts
export async function getAllSymbols() {
  //   console.log("[getAllSymbols] method call.");
  let dukascopySymbols = [];

  for (const row of Object.keys(metadata)) {
    const symbol = metadata[row];
    const type = await getSymboltype(row);
    dukascopySymbols.push({
      symbol: symbol.name,
      full_name: `Dukascopy:${symbol.name.replace(/\s/g, "")}`,
      description: symbol.description,
      exchange: "Dukascopy",
      type,
    });
  }

  return [...dukascopySymbols];
}
