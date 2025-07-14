"use client"
import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface CategoryPieChartProps {
  dashboardData: {
    categoryBreakdown: Record<string, number>;
    totalProducts: number;
  };
}

export function CategoryPieChart({ dashboardData }: CategoryPieChartProps) {
  // Transform your category data into chart format
  const chartData = Object.entries(dashboardData.categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([category, count], index) => ({
      category: category,
      count: count,
      fill: `var(--chart-${index + 1})`,
    }));

  // Generate chart config dynamically based on your categories
  const chartConfig = {
    count: {
      label: "Products",
    },
    ...chartData.reduce((acc, item, index) => {
      acc[item.category] = {
        label: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        color: `var(--chart-${index + 1})`,
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>),
  } satisfies ChartConfig;

  // Calculate percentage for trending info
  const totalDisplayed = chartData.reduce((sum, item) => sum + item.count, 0);
  const percentage = ((totalDisplayed / dashboardData.totalProducts) * 100).toFixed(1);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Products by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={chartData} dataKey="count">
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) =>
                  chartConfig[value]?.label || value
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Showing top {chartData.length} categories <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Displaying {percentage}% of total products ({totalDisplayed} of {dashboardData.totalProducts})
        </div>
      </CardFooter>
    </Card>
  );
}