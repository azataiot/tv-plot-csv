const { getHistoricalRates } = require("dukascopy-node");

(async () => {
  try {
    const data = await getHistoricalRates({
      instrument: "btcusd",
      dates: {
        from: new Date("2018-01-01"),
        to: new Date("2019-01-01"),
      },
      timeframe: "d1",
      format: "json",
    });

    console.log(data);
  } catch (error) {
    console.log("error", error);
  }
})();
