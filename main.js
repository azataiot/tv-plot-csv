import "./style.css";
// Datafeed implementation, will be added later
import Datafeed from "/src/datafeed.js";

// construct the chart
window.tvWidget = new TradingView.widget({
  debug: appConfig.debug,
  symbol: "Dukascopy:XAU/USD", //default symbol
  interval: "1D",
  fullscreen: true,
  container: "tv-chart",
  datafeed: Datafeed,
  library_path: "/charting_library/",
});

const getData = async () => {
  const res = await fetch(
    "/download/usatechidxusd-m1-bid-2022-01-20-2022-01-23.csv"
  );
  const resp = await res.text();
  const cdata = resp
    .split("\n")
    .slice(1)
    .map((row) => {
      const [timestamp, open, high, low, close, volume] = row.split(",");
      return {
        time: timestamp / 1000,
        open,
        high,
        low,
        close,
        volume,
      };
    });
  return cdata;
};

// getData();

const getVolume = async () => {
  const candleStickSeries = await getData();
  const vdata = candleStickSeries.map((row) => {
    const color =
      row.close - row.open > 0
        ? "rgba(0, 150, 136, 0.8)"
        : "rgba(255,82,82, 0.8)";
    return {
      time: row.time,
      value: row.volume,
      color,
    };
  });
  return vdata;
};

const domElement = document.getElementById("tv-chart");
