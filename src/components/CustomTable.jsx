import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

function CustomTable({ columns, data }) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const formatValue = (value, key) => {
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('price') || 
          key.toLowerCase().includes('amount') || 
          key.toLowerCase().includes('tax')) {
        return `₹${value.toFixed(2)}`;
      }
      return value.toString();
    }
    return value || '-';
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5'
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id || index}
              sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}
            >
              {columns.map((column) => (
                <TableCell key={`${row.id || index}-${column.key}`}>
                  {formatValue(row[column.key], column.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomTable; 