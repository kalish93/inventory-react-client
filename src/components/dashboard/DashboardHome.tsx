import React from "react";
import Expenses from "./Expenses";
import BankPositions from "./BankPostions";

const DashboardHome = () =>{
    return(
        <div >
            <Expenses/>
            <BankPositions/>
        </div>
    )
}

export default DashboardHome;