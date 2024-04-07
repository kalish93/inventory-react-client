import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectReport } from "../../features/report/reportSlice";
import { generateBankTransactionReport } from "../../features/report/reportActions";
import { Card, Button, TextField, MenuItem } from "@mui/material"; // Added MenuItem
import { selectBank } from "../../features/bank/bankSlice";
import { getBanks } from "../../features/bank/bankActions";

function BankTransactionReportGenerator() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, bankTransactionReport } = useSelector(selectReport);
  const { banks } = useSelector(selectBank);
  const [selectedBank, setSelectedBank] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);

  const handleGenerateReport = () => {
    dispatch(
      generateBankTransactionReport(
        selectedBank,
        startDate === "" ? undefined : new Date(startDate),
        endDate === "" ? undefined : new Date(endDate)
      )
    );
    setStartDate("");
    setEndDate("");
  };

  const handleDownloadReport = () => {
    if (bankTransactionReport) {
      const blob = new Blob([bankTransactionReport], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Concatenate bank name with the file name
      const fileName = `${
        selectedBank
          ? banks.items.find((bank) => bank.id === selectedBank)?.name
          : "bank"
      }-transaction-summary-${new Date().toLocaleDateString()}.pdf`;

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSelectedBank("");
    }
  };

  return (
    <div>
      <Card
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <h2>Bank Transaction Summary</h2>
        <TextField
          select
          label="Select Bank"
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          variant="outlined"
          style={{ width: "100%" }}
        >
          {banks.items.map((bank: any) => (
            <MenuItem key={bank.id} value={bank.id}>
              {bank.name}
            </MenuItem>
          ))}
        </TextField>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <TextField
            id="startDate"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            id="endDate"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        <Button
          variant="contained"
          onClick={handleGenerateReport}
          disabled={loading || selectedBank === ""}
        >
          {loading ? "Generating Report..." : "Generate Report"}
        </Button>
        {error && <div>Error: {error}</div>}
        {bankTransactionReport && (
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default BankTransactionReportGenerator;
