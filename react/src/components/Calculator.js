import React, { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const handleNumberClick = (value) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      if (value === '.' && display.includes('.')) {
        return;
      }
      setDisplay(display + value);
    }
    if (waitingForSecondOperand) {
      setWaitingForSecondOperand(false);
    }
  };

  const handleOperationClick = (op) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setWaitingForSecondOperand(true);
    setDisplay('0');
  };

  const handleEqualsClick = () => {
    if (!previousValue || !operation) return;

    const currentValue = parseFloat(display);
    let result = 0;

    if (operation === '+') {
      result = previousValue + currentValue;
    } else if (operation === '-') {
      result = previousValue - currentValue;
    } else if (operation === '*') {
      result = previousValue * currentValue;
    } else if (operation === '/') {
      if (currentValue === 0) {
        setDisplay('Error');
        return;
      }
      result = previousValue / currentValue;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
    '='
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 320,
          backgroundColor: '#1e1e1e',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            backgroundColor: '#1e1e1e',
            color: 'white',
            padding: 2,
            textAlign: 'right',
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            fontSize: '2.5rem',
            fontFamily: 'monospace',
            overflow: 'hidden'
          }}
        >
          <Typography variant="h4" sx={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {display}
          </Typography>
        </Box>
        <Grid container spacing={1} sx={{ padding: 2 }}>
          {buttons.map((btn) => (
            <Grid item xs={3} key={btn}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  if (btn === 'C') handleClearClick();
                  else if (btn === '=') handleEqualsClick();
                  else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                  else handleNumberClick(btn);
                }}
                sx={{
                  height: 60,
                  fontSize: '1.2rem',
                  backgroundColor: btn === '=' ? '#ff9500' : ['+', '-', '*', '/'].includes(btn) ? '#333333' : '#555555',
                  color: btn === '=' || ['+', '-', '*', '/'].includes(btn) ? 'white' : 'white',
                  '&:hover': {
                    backgroundColor: btn === '=' ? '#cc7a00' : ['+', '-', '*', '/'].includes(btn) ? '#444444' : '#666666'
                  },
                  borderRadius: 2
                }}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Calculator;
