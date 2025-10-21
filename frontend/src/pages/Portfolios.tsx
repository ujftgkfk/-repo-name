import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import { Add, Visibility, TrendingUp, TrendingDown } from '@mui/icons-material';
import { portfolioApi } from '../services/api';

export default function Portfolios() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    name: '',
    description: '',
    currency: 'USD',
    cashBalance: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const response = await portfolioApi.getAll();
      setPortfolios(response.data.data);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      await portfolioApi.create(newPortfolio);
      setOpenDialog(false);
      setNewPortfolio({ name: '', description: '', currency: 'USD', cashBalance: 0 });
      loadPortfolios();
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateTotalPnL = (positions: any[]) => {
    return positions.reduce((sum, pos) => sum + parseFloat(pos.unrealizedPnL || 0), 0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Portfolios
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Create Portfolio
        </Button>
      </Box>

      <Grid container spacing={3}>
        {portfolios.map((portfolio) => {
          const totalPnL = calculateTotalPnL(portfolio.positions || []);
          const isProfit = totalPnL >= 0;

          return (
            <Grid item xs={12} md={6} lg={4} key={portfolio.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {portfolio.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
                    {portfolio.description || 'No description'}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Total Value
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {formatCurrency(parseFloat(portfolio.totalValue))}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Cash Balance
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrency(parseFloat(portfolio.cashBalance))}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Positions
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {portfolio.positions?.length || 0}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="textSecondary">
                      Unrealized P&L
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {isProfit ? (
                        <TrendingUp color="success" fontSize="small" />
                      ) : (
                        <TrendingDown color="error" fontSize="small" />
                      )}
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={isProfit ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(totalPnL)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/portfolios/${portfolio.id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Portfolio Name"
            fullWidth
            value={newPortfolio.name}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newPortfolio.description}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Initial Cash Balance"
            type="number"
            fullWidth
            value={newPortfolio.cashBalance}
            onChange={(e) =>
              setNewPortfolio({ ...newPortfolio, cashBalance: parseFloat(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePortfolio} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
