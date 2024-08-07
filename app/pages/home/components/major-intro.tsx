import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const MajorIntroduction = () => {
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-4">
        <CardTitle>你相信AI吗？</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          AI 正在颠覆股市！我们利用先进的量化算法和 LSTM Transformer
          模型，精准预测短期股票趋势，
          助你做出更明智的投资决策。告别猜测，拥抱数据，让 AI 助力你的投资，
          获取更可观的收益！
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
