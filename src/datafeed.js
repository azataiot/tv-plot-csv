import { getSymbolTypes, getAllSymbols } from "/src/dukascopy-helpers.js";

// get all supported symbol types.
const symbols_types = await getSymbolTypes();

// parse csv get content
const getData = async () => {
  const res = await fetch("/download/xauusd-d1-bid-2019-03-01-2022-05-25.csv");
  const resp = await res.text();
  const cdata = resp
    .split("\n")
    .slice(1)
    .map((row) => {
      const [timestamp, open, high, low, close, volume] = row.split(",");
      return {
        time: timestamp / 1000.0,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
      };
    });
  return cdata;
};

// configuration data for the chart
const configurationData = {
  supported_resolutions: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "10",
    "15",
    "30",
    "60",
    "120",
    "240",
    "1D",
    "1W",
    "1M",
  ],
  exchanges: [
    {
      value: "Dukascopy",
      name: "Dukascopy",
      desc: "Dukascopy",
    },
  ],
  symbols_types: [...symbols_types, { name: "others", value: "others" }], // we have got that earlier using the getSymbolTypes nethod.
};

export default {
  onReady: (callback) => {
    console.log("[onReady]: ", configurationData);
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) => {
    const symbols = await getAllSymbols();
    const newSymbols = symbols.filter((symbol) => {
      const isExchangeValid = exchange === "" || symbol.exchange === exchange;
      const isFullSymbolContainsInput =
        symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(newSymbols);
  },
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    console.log("[resolveSymbol]: Method call", symbolName);
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(
      ({ full_name }) => full_name === symbolName
    );
    // can not resolve symbol
    if (!symbolItem) {
      onResolveErrorCallback("cannot resolve symbol");
      return;
    }
    // resolved symbol
    const symbolInfo = {
      ticker: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      exchange: symbolItem.exchange,
      has_intraday: true,
      has_no_volume: false,
      supported_resolutions: configurationData.supported_resolutions,
    };
    onSymbolResolvedCallback(symbolInfo);
  },
  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    console.log("[getBars]: Method call", symbolInfo, resolution, periodParams);
    // get timeframe string for the dukascopy-node
    let timeframe;
    if (resolution === "1D") {
      timeframe = "d1";
    } else if (parseInt(resolution) >= 60) {
      timeframe = "h1";
    } else if (parseInt(resolution) >= 15) {
      timeframe = "m15";
    } else if (parseInt(resolution) >= 5) {
      timeframe = "m5";
    } else {
      timeframe = "m1";
    }

    // return data from the csv
    const data = await getData();
    console.log(data);
    // onHistoryCallback(data, { noData: false });
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    console.log(
      "[subscribeBars]: Method call with subscribeUID:",
      subscribeUID
    );
  },
  unsubscribeBars: (subscriberUID) => {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
  },
};
