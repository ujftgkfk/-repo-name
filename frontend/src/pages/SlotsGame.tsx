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
  Card,
  CardContent
} from '@mui/material';
import { gameApi } from '../services/api';

const USER_ID = 1;

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐', '7️⃣', '🔔'];

export default function SlotsGame() {
  const [betAmount, setBetAmount] = useState('10');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [spinning, setSpinning] = useState(false);

  const handleSpin = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError('Please enter a valid bet amount');
      return;
    }

    setLoading(true);
    setSpinning(true);
    setError('');

    try {
      const response = await gameApi.playSlots({
        userId: USER_ID,
        betAmount: parseFloat(betAmount),
        clientSeed: `client-${Date.now()}`
      });

      setTimeout(() => {
        setResult(response.data);
        setSpinning(false);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to place bet');
      setSpinning(false);
    } finally {
      setLoading(false);
    }
  };

  const renderReels = () => {
    if (!result || spinning) {
      return (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                width: 80,
                height: 200,
                bgcolor: 'background.default',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                fontSize: '2rem',
                animation: spinning ? 'spin 0.3s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'translateY(0)' },
                  '100%': { transform: 'translateY(-50px)' }
                }
              }}
            >
              {spinning ? SYMBOLS.slice(0, 3).map((s, j) => <div key={j}>{s}</div>) : '❓'}
            </Box>
          ))}
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        {result.reels.map((reel: number[], i: number) => (
          <Box
            key={i}
            sx={{
              width: 80,
              height: 200,
              bgcolor: 'background.default',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
              fontSize: '2rem',
              border: result.isWin ? '3px solid' : 'none',
              borderColor: 'success.main'
            }}
          >
            {reel.map((symbol, j) => (
              <div key={j}>{SYMBOLS[symbol]}</div>
            ))}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Slots Game
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 4 }}>
          {renderReels()}
        </Box>

        {result && !spinning && (
          <Alert severity={result.isWin ? 'success' : 'info'} sx={{ mb: 3 }}>
            {result.isWin ? (
              <Typography>
                WIN! You won ${result.payout.toFixed(2)} with {result.multiplier}x multiplier!
              </Typography>
            ) : (
              <Typography>Try again! Better luck next spin!</Typography>
            )}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bet Amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSpin}
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {spinning ? 'Spinning...' : 'SPIN'}
            </Button>
          </Grid>
        </Grid>

        {error && <Alert severity="error">{error}</Alert>}
      </Paper>

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Last Result
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card sx={{ bgcolor: 'background.default' }}>
                <CardContent>
                  <Typography color="text.secondary">Payout</Typography>
                  <Typography variant="h6" color={result.isWin ? 'success.main' : 'text.primary'}>
                    ${result.payout.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ bgcolor: 'background.default' }}>
                <CardContent>
                  <Typography color="text.secondary">Balance</Typography>
                  <Typography variant="h6">${result.newBalance.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Paytable
        </Typography>
        <Typography color="text.secondary">
          • 5 matching symbols: 10x multiplier
        </Typography>
        <Typography color="text.secondary">
          • 4 matching symbols: 5x multiplier
        </Typography>
        <Typography color="text.secondary">
          • 3 matching symbols: 2x multiplier
        </Typography>
      </Paper>
    </Container>
  );
}
