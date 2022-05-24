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
