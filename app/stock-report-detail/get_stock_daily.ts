interface ApiResponse {
  data: {
    diff: { f12: string }[];
  };
}

interface CodeIdMap {
  [code: string]: number;
}

async function fetchData(params: URLSearchParams): Promise<{ f12: string }[]> {
  const url = "https://80.push2.eastmoney.com/api/qt/clist/get";
  const response = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
  });
  const data: ApiResponse = await response.json();
  return data.data.diff || [];
}

export async function codeIdMapEm(): Promise<CodeIdMap> {
  const paramsSH = new URLSearchParams({
    pn: "1",
    pz: "50000",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    fid: "f3",
    fs: "m:1 t:2,m:1 t:23",
    fields: "f12",
    _: "1623833739532",
  });

  const paramsSZ = new URLSearchParams({
    pn: "1",
    pz: "50000",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    fid: "f3",
    fs: "m:0 t:6,m:0 t:80",
    fields: "f12",
    _: "1623833739532",
  });

  const paramsBJ = new URLSearchParams({
    pn: "1",
    pz: "50000",
    po: "1",
    np: "1",
    ut: "bd1d9ddb04089700cf9c27f6f7426281",
    fltt: "2",
    invt: "2",
    fid: "f3",
    fs: "m:0 t:81 s:2048",
    fields: "f12",
    _: "1623833739532",
  });

  const dataSH = await fetchData(paramsSH);
  if (dataSH.length === 0) return {};

  const codeIdDict: CodeIdMap = {};
  dataSH.forEach((item) => {
    codeIdDict[item.f12] = 1;
  });

  const dataSZ = await fetchData(paramsSZ);
  if (dataSZ.length === 0) return {};

  dataSZ.forEach((item) => {
    codeIdDict[item.f12] = 0;
  });

  const dataBJ = await fetchData(paramsBJ);
  if (dataBJ.length === 0) return {};

  dataBJ.forEach((item) => {
    codeIdDict[item.f12] = 0;
  });

  return codeIdDict;
}

interface StockData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  turnover: number;
  amplitude: number;
  changePercent: number;
  changeAmount: number;
  turnoverRate: number;
  stockCode: string;
}

export async function stockZhAHist(
  symbol: string = "000001",
  period: string = "daily",
  startDate: string = "19700101",
  endDate: string = "20500101",
  adjust: string = ""
): Promise<Array<StockData>> {
  const codeIdDict = await codeIdMapEm();
  const adjustDict: { [key: string]: string } = { qfq: "1", hfq: "2", "": "0" };
  const periodDict: { [key: string]: string } = {
    daily: "101",
    weekly: "102",
    monthly: "103",
  };

  const url = "https://push2his.eastmoney.com/api/qt/stock/kline/get";
  const params = new URLSearchParams({
    fields1: "f1,f2,f3,f4,f5,f6",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f116",
    ut: "7eea3edcaed734bea9cbfc24409ed989",
    klt: periodDict[period],
    fqt: adjustDict[adjust],
    secid: `${codeIdDict[symbol]}.${symbol}`,
    beg: startDate,
    end: endDate,
    _: "1623766962675",
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
  });
  const data = await response.json();

  if (!data.data || !data.data.klines) {
    return [];
  }

  const tempData = data.data.klines.map((item: any) => {
    const [
      date,
      open,
      close,
      high,
      low,
      volume,
      turnover,
      amplitude,
      changePercent,
      changeAmount,
      turnoverRate,
    ] = item.split(",");

    return {
      date,
      open: parseFloat(open),
      close: parseFloat(close),
      high: parseFloat(high),
      low: parseFloat(low),
      volume: parseFloat(volume),
      turnover: parseFloat(turnover),
      amplitude: parseFloat(amplitude),
      changePercent: parseFloat(changePercent),
      changeAmount: parseFloat(changeAmount),
      turnoverRate: parseFloat(turnoverRate),
      stockCode: symbol,
    };
  });

  return tempData;
}
