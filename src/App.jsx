import React, { useState } from 'react';
import { Container, Box, Paper, Button } from '@mui/material';
import FileUpload from './components/FileUpload.jsx';
import TabPanel from './components/TabPanel.jsx';

function App() {
  const [tableData, setTableData] = useState({
    customers: [],
    products: [],
    invoices: []
  });

  const handleFileProcessed = (newData) => {
    setTableData(prevData => ({
      customers: [...prevData.customers, ...newData.customers],
      products: [...prevData.products, ...newData.products],
      invoices: [...prevData.invoices, ...newData.invoices]
    }));
  };

  const handleClearData = () => {
    setTableData({
      customers: [],
      products: [],
      invoices: []
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <FileUpload onFileProcessed={handleFileProcessed} />
          {(tableData.customers.length > 0 || 
            tableData.products.length > 0 || 
            tableData.invoices.length > 0) && (
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleClearData}
                size="small"
              >
                Clear All Data
              </Button>
            </Box>
          )}
        </Paper>
        <Paper sx={{ mt: 3 }}>
          <TabPanel data={tableData} />
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
