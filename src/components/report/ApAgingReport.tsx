import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { selectReport } from '../../features/report/reportSlice';
import { Card, Button, TextField } from '@mui/material';
import { generateApAgingReport } from '../../features/report/reportActions';

function ApAgingReportGenerator() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, apAgingReport } = useSelector(selectReport);
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = () => {
    dispatch(generateApAgingReport(endDate));
  };

  const handleDownloadReport = () => {
    if (apAgingReport) {
      const blob = new Blob([apAgingReport], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'A/P-aging-summary.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Card style={{padding:'20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px'}}>
        <h2>A/P Aging Summary</h2>
        <div>
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
        {apAgingReport && (
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

export default ApAgingReportGenerator;
