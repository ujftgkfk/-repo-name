import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Slider,
  Box,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { gameApi } from '../services/api';

const USER_ID = 1;

export default function DiceGame() {
  const [betAmount, setBetAmount] = useState('10');
  const [target, setTarget] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const winChance = isOver ? (100 - target) : target;
  const multiplier = (100 / winChance) * 0.99;

  const handleBet = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError('Please enter a valid bet amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await gameApi.playDice({
        userId: USER_ID,
        betAmount: parseFloat(betAmount),
        target,
        isOver,
        clientSeed: `client-${Date.now()}`
      });

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dice Game
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Place Your Bet
            </Typography>

            <TextField
              fullWidth
              label="Bet Amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>Target: {target.toFixed(2)}</Typography>
            <Slider
              value={target}
              onChange={(_, value) => setTarget(value as number)}
              min={1}
              max={99}
              step={0.01}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant={isOver ? 'contained' : 'outlined'}
                onClick={() => setIsOver(true)}
              >
                Over {target.toFixed(2)}
              </Button>
              <Button
                fullWidth
                variant={!isOver ? 'contained' : 'outlined'}
                onClick={() => setIsOver(false)}
              >
                Under {target.toFixed(2)}
              </Button>
            </Box>

            <Card sx={{ mb: 2, bgcolor: 'background.default' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Win Chance:</Typography>
                  <Typography fontWeight="bold">{winChance.toFixed(2)}%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Multiplier:</Typography>
                  <Typography fontWeight="bold">{multiplier.toFixed(4)}x</Typography>
                </Box>
              </CardContent>
            </Card>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleBet}
              disabled={loading}
            >
              {loading ? 'Rolling...' : 'Roll Dice'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {result && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Result
              </Typography>

              <Box
                sx={{
                  p: 4,
                  bgcolor: result.isWin ? 'success.main' : 'error.main',
                  borderRadius: 2,
                  textAlign: 'center',
                  mb: 3
                }}
              >
                <Typography variant="h2" fontWeight="bold">
                  {result.result.toFixed(2)}
                </Typography>
                <Typography variant="h6">
                  {result.isWin ? 'WIN!' : 'LOSE'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                  <Typography color="text.secondary">Profit:</Typography>
                  <Typography
                    color={result.profit >= 0 ? 'success.main' : 'error.main'}
                    fontWeight="bold"
                  >
                    {result.profit >= 0 ? '+' : ''}${result.profit.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">New Balance:</Typography>
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
