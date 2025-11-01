import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { gameApi } from '../services/api';

const USER_ID = 1;

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

export default function RouletteGame() {
  const [betAmount, setBetAmount] = useState('10');
  const [betType, setBetType] = useState('red');
  const [betValue, setBetValue] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBet = async (type: string, value: number | null = null) => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError('Please enter a valid bet amount');
      return;
    }

    setLoading(true);
    setError('');
    setBetType(type);
    setBetValue(value);

    try {
      const response = await gameApi.playRoulette({
        userId: USER_ID,
        betAmount: parseFloat(betAmount),
        betType: type,
        betValue: value,
        clientSeed: `client-${Date.now()}`
      });

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'success';
    return RED_NUMBERS.includes(num) ? '#FF4C5A' : '#1a1e2e';
  };

  const renderWheel = () => {
    const numbers = [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
      20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];

    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          justifyContent: 'center',
          mb: 3
        }}
      >
        {numbers.map((num) => (
          <Chip
            key={num}
            label={num}
            onClick={() => handleBet('straight', num)}
            disabled={loading}
            sx={{
              width: 40,
              height: 40,
              fontSize: '0.875rem',
              fontWeight: 'bold',
              bgcolor: getNumberColor(num),
              color: '#fff',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              },
              border: result && result.result === num ? '3px solid' : 'none',
              borderColor: 'primary.main'
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Roulette
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Roulette Wheel
            </Typography>
            {renderWheel()}

            {result && (
              <Box
                sx={{
                  p: 3,
                  bgcolor: result.isWin ? 'success.main' : 'error.main',
                  borderRadius: 2,
                  textAlign: 'center',
                  mb: 3
                }}
              >
                <Typography variant="h3" fontWeight="bold">
                  {result.result}
                </Typography>
                <Typography variant="h6">
                  {result.isWin ? `WIN! +$${result.profit.toFixed(2)}` : 'LOSE'}
                </Typography>
              </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Place Bet
            </Typography>

            <TextField
              fullWidth
              label="Bet Amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Color Bets
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleBet('red')}
                disabled={loading}
                sx={{ bgcolor: '#FF4C5A', '&:hover': { bgcolor: '#cc3d48' } }}
              >
                Red (2x)
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleBet('black')}
                disabled={loading}
                sx={{ bgcolor: '#1a1e2e', '&:hover': { bgcolor: '#0f121a' } }}
              >
                Black (2x)
              </Button>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Number Bets
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleBet('even')}
                disabled={loading}
              >
                Even (2x)
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleBet('odd')}
                disabled={loading}
              >
                Odd (2x)
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleBet('low')}
                disabled={loading}
              >
                1-18 (2x)
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleBet('high')}
                disabled={loading}
              >
                19-36 (2x)
              </Button>
            </Box>
          </Paper>

          {result && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Result
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Number:</Typography>
                  <Typography fontWeight="bold">{result.result}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Multiplier:</Typography>
                  <Typography>{result.multiplier}x</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Payout:</Typography>
                  <Typography color={result.isWin ? 'success.main' : 'error.main'}>
                    ${result.payout.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Balance:</Typography>
                  <Typography fontWeight="bold">${result.newBalance.toFixed(2)}</Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
