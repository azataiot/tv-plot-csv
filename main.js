import "./style.css";
import { createChart } from "lightweight-charts";

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
const chartProperties = {
  height: domElement.offsetHeight,
  width:domElement.offsetWidth
};

const chart = createChart(domElement, chartProperties);

const candleSeries = chart.addCandlestickSeries();

const volumeSeries = chart.addHistogramSeries({
  color: "#182233",
  lineWidth: 2,
  priceFormat: {
    type: "volume",
  },
  overlay: true,
  scaleMargins: {
    top: 0.9,
    bottom: 0,
  },
});

const candleStickSeries = await getData();
const volumeSeriesData = await getVolume();

candleSeries.setData(candleStickSeries);
volumeSeries.setData(volumeSeriesData);

// resize

function resize() {
  const width = domElement.offsetWidth;
  const height = domElement.offsetHeight;
  // test
  console.log("[window resized]:w,h", height, width);
  chart.applyOptions({
    width,
    height,
  });
}

resize();

new ResizeObserver(resize).observe(domElement);

chart.timeScale();
