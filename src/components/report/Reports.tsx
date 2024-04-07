import React from "react";
import CustomerAgingReportGenerator from "./customerAgingReport";
import BankTransactionReportGenerator from "./bankTransactionReport";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import ApAgingReportGenerator from "./ApAgingReport";

const Reports = () => {
  return (
   <>
   <h1>Reports</h1>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      {hasPermission(PERMISSIONS.GenerateCustomerAgingReport) && <CustomerAgingReportGenerator />}
      {hasPermission(PERMISSIONS.GenerateAPAgingReport) && <ApAgingReportGenerator />}
      {hasPermission(PERMISSIONS.GenerateBankTransactionReport) && <BankTransactionReportGenerator />}
    </div>
   </>
  );
}

export default Reports;
