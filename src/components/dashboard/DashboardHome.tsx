import React from "react";
import Expenses from "./Expenses";
import BankPositions from "./BankPostions";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import ReportGenerator from "../report/customerAgingReport";


const DashboardHome = () =>{
    return(
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px'}}>
            {hasPermission(PERMISSIONS.GetAllExpenses) && <Expenses/>}
            {/* {hasPermission(PERMISSIONS.GetAllBanks) && <BankPositions/>} */}
            <ReportGenerator/>
        </div>
    )
}

export default DashboardHome;