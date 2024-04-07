import { AppDispatch } from "../../app/store";
import { selectDashboard } from "../../features/dashboard/dashboardSlice";
import { getExpenses } from "../../features/dashboard/dashboardActions";
import React, { useEffect, useState } from "react";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { LegendComponent, TitleComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, TextField } from "@mui/material";

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
        subtext: "Total Expense: " + data?.totalExpense.toLocaleString(),
        right: "78%",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "",
        left: "30%",
        type: "scroll",
        top: "middle",
        formatter: function (name: string) {
          const expense = data?.detailExpenses.find(
            (item) => item.name === name
          );
          return `${name} - ${expense?.amount.toLocaleString()}`;
        },
      },
      series: [
        {
          name: "Expense",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          right: "70%",
          top: "10%",
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

  return <div id="pieChart" style={{ height: 300 }} />;
};

const Expenses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboardState = useSelector(selectDashboard);
  const expenses = dashboardState.expenses;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const handleFilter = () => {
    // Dispatch the action with the selected date range
    dispatch(getExpenses(startDate, endDate));
  };

  const handleRemoveFilter = () => {
    // Clear the date range selections
    setStartDate("");
    setEndDate("");
    // Fetch all expenses
    dispatch(getExpenses());
  };

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  return (
    <Card
      variant="outlined"
      style={{
        boxSizing: "border-box",
        width: "100%",
        padding: "10px",
        paddingRight: "0rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "15px",
        }}
      >
        <TextField
          id="startDate"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          name="startDate"
          value={startDate}
          onChange={handleDateChange}
          size="small"
        />
        <TextField
          id="endDate"
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          name="endDate"
          value={endDate}
          onChange={handleDateChange}
          size="small"
        />
        <Button variant="contained" onClick={handleFilter}>
          Apply Filter
        </Button>
        <Button
          color="warning"
          variant="contained"
          onClick={handleRemoveFilter}
        >
          Remove Filter
        </Button>
      </div>
      <PieChartComponent data={expenses} />
    </Card>
  );
};

export default Expenses;
