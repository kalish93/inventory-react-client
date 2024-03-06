import React from "react";
import Expenses from "./Expenses";
import BankPositions from "./BankPostions";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";


const DashboardHome = () =>{
    return(
        <div >
            {hasPermission(PERMISSIONS.GetAllExpenses) && <Expenses/>}
            {hasPermission(PERMISSIONS.GetAllBanks) && <BankPositions/>}
        </div>
    )
}

export default DashboardHome;