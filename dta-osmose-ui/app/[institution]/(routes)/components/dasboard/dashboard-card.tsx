import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";

type DashboardCardProps = {
  title: string;
  description: string;
   value: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down";
  footerTop?: string;
  footerBottom?: string;
};

export const DashboardCard = ({
  title,
  description,
  value,
  trend = "+0%",
  trendDirection = "up",
  footerTop = "",
  footerBottom = "",
}: DashboardCardProps) => {
  const TrendIcon = trendDirection === "up" ? IconTrendingUp : IconTrendingDown;

  return (
    <Card className="@container/card" data-slot="card">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendIcon className="w-4 h-4" />
            {trend}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footerTop} <TrendIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">{footerBottom}</div>
      </CardFooter>
    </Card>
  );
};