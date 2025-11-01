import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { gameApi } from '../services/api';

const USER_ID = 1;

export default function History() {
  const [bets, setBets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('all');

  useEffect(() => {
    fetchData();
  }, [selectedGame]);

  const fetchData = async () => {
    try {
      const [betsResponse, statsResponse] = await Promise.all([
        gameApi.getBetHistory(USER_ID, selectedGame === 'all' ? undefined : selectedGame, 50),
        gameApi.getUserStats(USER_ID)
      ]);

      setBets(betsResponse.data.bets);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Betting History
      </Typography>

      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Bets
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalBets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Wagered
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ${stats.totalWagered.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Profit
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={stats.totalProfit >= 0 ? 'success.main' : 'error.main'}
                >
                  {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Win Rate
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.winRate.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stats.wins}W / {stats.losses}L
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedGame}
          onChange={(_, value) => setSelectedGame(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Games" value="all" />
          <Tab label="Dice" value="dice" />
          <Tab label="Slots" value="slots" />
          <Tab label="Roulette" value="roulette" />
          <Tab label="Blackjack" value="blackjack" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Game</TableCell>
              <TableCell align="right">Bet Amount</TableCell>
              <TableCell align="right">Multiplier</TableCell>
              <TableCell align="right">Payout</TableCell>
              <TableCell align="right">Profit</TableCell>
              <TableCell>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : bets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No bets found
                </TableCell>
              </TableRow>
            ) : (
              bets.map((bet) => (
                <TableRow key={bet.id} hover>
                  <TableCell>{formatDate(bet.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={bet.game.toUpperCase()}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">${bet.betAmount.toFixed(2)}</TableCell>
                  <TableCell align="right">{bet.multiplier.toFixed(2)}x</TableCell>
                  <TableCell align="right">${bet.payout.toFixed(2)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: bet.profit >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold'
                    }}
                  >
                    {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bet.isWin ? 'WIN' : 'LOSE'}
                      size="small"
                      color={bet.isWin ? 'success' : 'error'}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
