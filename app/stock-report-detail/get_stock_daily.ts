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
