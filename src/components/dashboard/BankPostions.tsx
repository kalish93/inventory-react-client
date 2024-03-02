import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectDashboard } from "../../features/dashboard/dashboardSlice";
import { getBankPositions } from "../../features/dashboard/dashboardActions";
import { Card, CardHeader, CardContent, Typography, Grid } from "@mui/material";

const BankPositions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboardState = useSelector(selectDashboard);
  const bankPositions = dashboardState.bankPositions;

  useEffect(() => {
    dispatch(getBankPositions());
  }, [dispatch]);

  return (
    <div>
      <Card>
        <CardHeader title="Bank Accounts" />
        <CardContent>
          <Grid container spacing={2}>
            {bankPositions.map((position: any, index: any) => (
              <Grid item xs={6} key={index}>
                <Typography>{position.name} - Amount: {position.amount}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankPositions;
