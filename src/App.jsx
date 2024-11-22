import React, { useState } from 'react';
import { Container, Box, Paper, Button, Typography } from '@mui/material';
import FileUpload from './components/FileUpload.jsx';
import TabPanel from './components/TabPanel.jsx';

function App() {
  const [tableData, setTableData] = useState({
    customers: [],
    products: [],
    invoices: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileProcessed = (newData) => {
    setIsLoading(false);
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
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold" 
              sx={{ mb: 3, textAlign: 'center' }}
            >
              Data Extraction & Invoice Management
            </Typography>
            <FileUpload 
              onFileProcessed={handleFileProcessed} 
              onLoadingChange={setIsLoading} 
            />
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
            <TabPanel data={tableData} isLoading={isLoading} />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
