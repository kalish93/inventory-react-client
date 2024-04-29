import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { selectReport } from '../../features/report/reportSlice';
import { generateTrialBalance } from '../../features/report/reportActions';
import { Card, Button, TextField } from '@mui/material';


function TrialBalanceReportGenerator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, trialBalanceReport } = useSelector(selectReport);

  const handleGenerateReport = () => {
    dispatch(generateTrialBalance(startDate === "" ? undefined : new Date(startDate),
    endDate === "" ? undefined : new Date(endDate)));
  };
  

  const handleDownloadReport = () => {
    if (trialBalanceReport) {
      const blob = new Blob([trialBalanceReport], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'trial-balance-report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Card style={{padding:'20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px'}}>
        <h2>Trial Balance</h2>
        <div style={{display: "flex", gap: "1.5rem" }}>
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
          disabled={loading}
        >
          {loading ? 'Generating Report...' : 'Generate Report'}
        </Button>
        {error && <div>Error: {error}</div>}
        {trialBalanceReport && (
          <div>
            <Button variant="contained" color='secondary' onClick={handleDownloadReport}>
              Download Report
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default TrialBalanceReportGenerator;
