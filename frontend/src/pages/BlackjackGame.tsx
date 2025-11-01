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
  Card
} from '@mui/material';
import { gameApi } from '../services/api';

const USER_ID = 1;

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function BlackjackGame() {
  const [betAmount, setBetAmount] = useState('10');
  const [gameState, setGameState] = useState<any>(null);
  const [playerCards, setPlayerCards] = useState<number[]>([]);
  const [dealerCards, setDealerCards] = useState<number[]>([]);
  const [playerValue, setPlayerValue] = useState(0);
  const [dealerValue, setDealerValue] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gameActive, setGameActive] = useState(false);

  const getCardDisplay = (cardNum: number) => {
    const suit = SUITS[Math.floor(cardNum / 13)];
    const value = VALUES[cardNum % 13];
    const isRed = suit === '♥' || suit === '♦';

    return { suit, value, isRed };
  };

  const handleDeal = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError('Please enter a valid bet amount');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await gameApi.playBlackjack({
        userId: USER_ID,
        betAmount: parseFloat(betAmount),
        action: 'deal',
        clientSeed: `client-${Date.now()}`
      });

      setPlayerCards(response.data.playerCards);
      setDealerCards(response.data.dealerCards);
      setPlayerValue(response.data.playerValue);
      setGameState(response.data.gameState);
      setGameActive(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to deal cards');
    } finally {
      setLoading(false);
    }
  };

  const handleHit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await gameApi.playBlackjack({
        userId: USER_ID,
        betAmount: parseFloat(betAmount),
        action: 'hit',
        gameState,
        clientSeed: `client-${Date.now()}`
      });

      if (response.data.action === 'bust') {
        setDealerCards(response.data.dealerCards);
        setDealerValue(response.data.dealerValue);
        setResult(response.data);
        setGameActive(false);
      } else {
        setPlayerCards(response.data.playerCards);
        setPlayerValue(response.data.playerValue);
        setGameState(response.data.gameState);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to hit');
    } finally {
      setLoading(false);
    }
  };

  const handleStand = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await gameApi.playBlackjack({
        userId: USER_ID,
        betAmount: parseFloat(betAmount),
        action: 'stand',
        gameState,
        clientSeed: `client-${Date.now()}`
      });

      setDealerCards(response.data.dealerCards);
      setDealerValue(response.data.dealerValue);
      setResult(response.data);
      setGameActive(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to stand');
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (cardNum: number, hidden = false) => {
    if (hidden) {
      return (
        <Card
          sx={{
            width: 60,
            height: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#7F3FF2',
            color: '#fff'
          }}
        >
          <Typography variant="h6">?</Typography>
        </Card>
      );
    }

    const { suit, value, isRed } = getCardDisplay(cardNum);

    return (
      <Card
        sx={{
          width: 60,
          height: 90,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fff',
          color: isRed ? '#FF4C5A' : '#1a1e2e',
          border: '2px solid',
          borderColor: 'grey.300'
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="h5">{suit}</Typography>
      </Card>
    );
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Blackjack
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Dealer's Hand {dealerValue > 0 && `(${dealerValue})`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {dealerCards.map((card, i) => (
              <div key={i}>{renderCard(card, gameActive && i > 0)}</div>
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Your Hand {playerValue > 0 && `(${playerValue})`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {playerCards.map((card, i) => (
              <div key={i}>{renderCard(card)}</div>
            ))}
          </Box>
        </Box>

        {result && (
          <Alert severity={result.isWin ? 'success' : 'info'} sx={{ mb: 3 }}>
            <Typography>
              {result.result === 'win' && `You Win! +$${result.profit.toFixed(2)}`}
              {result.result === 'lose' && `Dealer Wins. -$${Math.abs(result.profit).toFixed(2)}`}
              {result.result === 'push' && 'Push! Bet returned.'}
              {result.result === 'bust' && 'Bust! You went over 21.'}
            </Typography>
          </Alert>
        )}

        <Grid container spacing={2}>
          {!gameActive ? (
            <>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Bet Amount"
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleDeal}
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  Deal
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleHit}
                  disabled={loading}
                >
                  Hit
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleStand}
                  disabled={loading}
                >
                  Stand
                </Button>
              </Grid>
            </>
          )}
        </Grid>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Game Result
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Your Hand:</Typography>
              <Typography>{result.playerValue}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Dealer's Hand:</Typography>
              <Typography>{result.dealerValue}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Payout:</Typography>
              <Typography color={result.isWin ? 'success.main' : 'text.primary'}>
                ${result.payout?.toFixed(2) || '0.00'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">New Balance:</Typography>
              <Typography fontWeight="bold">${result.newBalance?.toFixed(2)}</Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}
