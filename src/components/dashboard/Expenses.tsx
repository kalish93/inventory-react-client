import { AppDispatch } from "../../app/store";
import { selectDashboard } from "../../features/dashboard/dashboardSlice";
import { getExpenses } from "../../features/dashboard/dashboardActions";
import React, { useEffect } from "react";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@mui/material";

interface ExpenseData {
  totalExpense: number;
  detailExpenses: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}
echarts.use([TitleComponent, LegendComponent, PieChart, CanvasRenderer]);
const PieChartComponent: React.FC<{ data: ExpenseData }> = ({ data }) => {
  useEffect(() => {
    const chartDom = document.getElementById("pieChart");
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "Expenses Chart",
        subtext: "Total Expence: " + data?.totalExpense,
        left: 'center'
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        right: "10%",
        top: "middle",
        formatter: function (name: string) {
      const expense = data?.detailExpenses.find((item) => item.name === name);
      return `${name} - ${expense?.amount}`;
    },
      },
      series: [
        {
          name: "Expense",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
            formatter: function (params: any) {
          const { name, percent } = params;
          return `${name}\n${percent.toFixed(2)}%`;
        },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: data?.detailExpenses?.map((expense: any) => ({
            value: expense.amount,
            name: expense.name,
          })),
        },
      ],
    };

    myChart.setOption(option);
    return () => {
      myChart.dispose();
    };
  }, [data]);

  return <div id="pieChart" style={{ height: 300, width: 1200 }} />;
};

const Expenses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboardState = useSelector(selectDashboard);
  const expenses = dashboardState.expenses;

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  return (
        <Card variant="outlined">
      <PieChartComponent data={expenses} />
      </Card>
    
  );
};

export default Expenses;
