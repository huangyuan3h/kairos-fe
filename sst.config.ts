import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { getTableConfig } from "./cdk/table";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

const certArn =
  "arn:aws:acm:us-east-1:319653899185:certificate/dde24c52-09e4-4058-b1d0-2a7769f24e3a";

export default {
  config(_input) {
    return {
      name: "kairos-fe",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const customDomain = {
        domainName: "kairos.it-t.xyz",
        isExternalDomain: true,
        cdk: {
          certificate: Certificate.fromCertificateArn(stack, "MyCert", certArn),
        },
      };
      const { stockPredictReport } = getTableConfig(stack);
      const site = new NextjsSite(stack, "site", {
        bind: [stockPredictReport],
        customDomain: stack.stage === "prod" ? customDomain : undefined,
        environment: {
          STOCK_PREDICT_REPORT: process.env.STOCK_PREDICT_REPORT ?? "",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
