import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';

function CustomTable({ columns, data, onEdit }) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const formatValue = (value, key, row) => {
    if (key === 'actions') {
      return (
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: '#d32f2f',
            color: 'white',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
            minWidth: '50px',
            padding: '4px 12px',
            fontSize: '0.75rem',
          }}
          onClick={() => onEdit(row)}
        >
          Edit
        </Button>
      );
    }
    if (key === 'fileName') {
      return value.split('.').slice(0, -1).join('.').split('/').pop();
    }
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
              <TableCell 
                key={column.key}
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  ...(column.key === 'actions' && {
                    width: '80px'
                  })
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={row.id || index}
              sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}
            >
              {columns.map((column) => (
                <TableCell 
                  key={`${row.id || index}-${column.key}`}
                >
                  {formatValue(row[column.key], column.key, row)}
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