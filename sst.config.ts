import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { getTableConfig } from "./cdk/table";

export default {
  config(_input) {
    return {
      name: "kairos-fe",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const { stockPredictReport, stockClassifyPredictReport } =
        getTableConfig(stack);
      const site = new NextjsSite(stack, "site", {
        bind: [stockPredictReport, stockClassifyPredictReport],
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
