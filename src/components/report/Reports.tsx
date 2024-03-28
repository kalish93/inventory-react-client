import React from "react";
import CustomerAgingReportGenerator from "./customerAgingReport";
import BankTransactionReportGenerator from "./bankTransactionReport";

const Reports = () => {
  return (
   <>
   <h1>Reports</h1>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <CustomerAgingReportGenerator />
      <BankTransactionReportGenerator />
    </div>
   </>
  );
}

export default Reports;
