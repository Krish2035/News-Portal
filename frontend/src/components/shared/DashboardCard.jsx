import React from "react";
import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

const DashboardCard = ({
  title,
  description,
  endAngle,
  totalValue,
  lastMonthValue,
  footerText,
  chartData,
  chartConfig,
}) => {
  // 1. Force a valid number for angles. If 0, use a tiny offset (0.1)
  // as some Recharts versions struggle to calculate a path of exactly 0.
  const safeEndAngle =
    !endAngle || isNaN(endAngle) || endAngle === 0 ? 0.1 : endAngle;

  // 2. Fallback for the central text display
  const displayValue = totalValue || 0;

  return (
    <Card className="flex flex-col shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          {/* CRITICAL FIX: key={totalValue} 
            This forces a clean re-render when the data changes, 
            stopping the NaN animation error.
          */}
          <RadialBarChart
            key={displayValue}
            data={
              chartData && chartData.length > 0 ? chartData : [{ value: 0 }]
            }
            startAngle={0}
            endAngle={safeEndAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {displayValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium text-green-500">
          Last month: {lastMonthValue || 0} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">{footerText}</div>
      </CardFooter>
    </Card>
  );
};

export default DashboardCard;