import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { processFileWithGemini } from '../services/geminiService';

function FileUpload({ onFileProcessed }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      const result = await processFileWithGemini(file);
      const parsedData = parseGeminiResponse(result, file.name);
      onFileProcessed(parsedData);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #cccccc',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main'
        }
      }}
    >
      <input {...getInputProps()} />
      <Typography>
        {isDragActive
          ? "Drop the file here..."
          : "Drag 'n' drop a PDF or image file, or click to select"
        }
      </Typography>
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
        Supported formats: PDF, JPG, JPEG, PNG
      </Typography>
    </Box>
  );
}

function parseGeminiResponse(response, fileName) {
  try {
    const jsonString = response.replace(/```json\n|\n```/g, '').trim();
    let parsedData = JSON.parse(jsonString);
    const timestamp = Date.now();

    return {
      customers: parsedData.customers.map(customer => ({
        id: `customer-${timestamp}-${Math.random()}`,
        fileName: fileName,
        customerName: customer.customerName || customer['Customer Name'] || '',
        phoneNumber: customer.phoneNumber || customer['Phone Number'] || '',
        totalPurchaseAmount: customer.totalPurchaseAmount || customer['Total Purchase Amount'] || 0
      })),
      
      invoices: parsedData.invoices.map(invoice => ({
        id: `invoice-${timestamp}-${Math.random()}`,
        fileName: fileName,
        serialNumber: invoice.serialNumber || invoice['Serial Number'] || '',
        customerName: invoice.customerName || invoice['Customer Name'] || '',
        productName: invoice.productName || invoice['Product Name'] || '',
        quantity: invoice.quantity || invoice.Quantity || 0,
        tax: invoice.tax || invoice.Tax || 0,
        totalAmount: invoice.totalAmount || invoice['Total Amount'] || 0,
        date: invoice.date || invoice.Date || '',
        discount: invoice.discount || invoice.Discount || 0
      })),
      
      products: parsedData.products.map(product => ({
        id: `product-${timestamp}-${Math.random()}`,
        fileName: fileName,
        name: product.name || product.Name || '',
        quantity: product.quantity || product.Quantity || 0,
        unitPrice: product.unitPrice || product['Unit Price'] || 0,
        tax: product.tax || product.Tax || 0,
        priceWithTax: product.priceWithTax || product['Price with Tax'] || 0,
        discount: product.discount || product.Discount || 0
      }))
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return {
      customers: [],
      products: [],
      invoices: []
    };
  }
}

export default FileUpload; 