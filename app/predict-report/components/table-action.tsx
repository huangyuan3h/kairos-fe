import { ExtraColumnProps } from "@/components/predict-report-table";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead } from "@/components/ui/table";
import { Plus, Minus } from "lucide-react";

export const ActionHeader: React.FC = () => {
  return <TableHead>操作</TableHead>;
};

export enum MoveAction {
  MOVE_IN = "MOVE_IN",
  MOVE_OUT = "MOVE_OUT",
}

export const MoveInAction: React.FC<ExtraColumnProps> = ({
  stock,
  onExtraClick,
}: ExtraColumnProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onExtraClick) onExtraClick(MoveAction.MOVE_IN, stock.stock_code);
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <TableCell>
      <Button size={"sm"} variant={"outline"} onClick={handleClick}>
        <Plus className="inline-block h-4 w-4 text-blue-600" />
      </Button>
    </TableCell>
  );
};

export const MoveOutAction: React.FC<ExtraColumnProps> = ({
  stock,
  onExtraClick,
}: ExtraColumnProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onExtraClick) onExtraClick(MoveAction.MOVE_OUT, stock.stock_code);
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <TableCell>
      <Button size={"sm"} variant={"outline"} onClick={handleClick}>
        <Minus className="inline-block h-4 w-4 text-blue-600" />
      </Button>
    </TableCell>
  );
};
