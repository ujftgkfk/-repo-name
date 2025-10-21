import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { portfolioApi, assetApi, tradeApi } from '../services/api';

export default function Trading() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTrade, setNewTrade] = useState({
    portfolioId: '',
    assetId: '',
    tradeType: 'BUY',
    quantity: 0,
    price: 0,
    fees: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [portfoliosRes, assetsRes, tradesRes] = await Promise.all([
        portfolioApi.getAll(),
        assetApi.getAll(),
        tradeApi.getAll()
      ]);

      setPortfolios(portfoliosRes.data.data);
      setAssets(assetsRes.data.data);
      setTrades(tradesRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCreateTrade = async () => {
    try {
      await tradeApi.create(newTrade);
      setOpenDialog(false);
      setNewTrade({
        portfolioId: '',
        assetId: '',
        tradeType: 'BUY',
        quantity: 0,
        price: 0,
        fees: 0
      });
      loadData();
    } catch (error) {
      console.error('Error creating trade:', error);
    }
  };

  const handleExecuteTrade = async (tradeId: string) => {
    try {
      await tradeApi.execute(tradeId);
      loadData();
    } catch (error) {
      console.error('Error executing trade:', error);
    }
  };

  const handleCancelTrade = async (tradeId: string) => {
    try {
      await tradeApi.cancel(tradeId);
      loadData();
    } catch (error) {
      console.error('Error cancelling trade:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXECUTED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Trading
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
          New Trade
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Create trade orders and execute them. All trades will update your portfolio positions and
        cash balance.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            All Trades
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Portfolio</TableCell>
                  <TableCell>Asset</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.portfolio?.name}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{trade.asset?.symbol}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {trade.asset?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={trade.tradeType}
                        color={trade.tradeType === 'BUY' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{parseFloat(trade.quantity).toFixed(4)}</TableCell>
                    <TableCell align="right">{formatCurrency(parseFloat(trade.price))}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(parseFloat(trade.totalAmount))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={trade.status}
                        color={getStatusColor(trade.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {trade.status === 'PENDING' && (
                        <Box display="flex" gap={1}>
                          <Button size="small" onClick={() => handleExecuteTrade(trade.id)}>
                            Execute
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleCancelTrade(trade.id)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Trade</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Portfolio</InputLabel>
            <Select
              value={newTrade.portfolioId}
              onChange={(e) => setNewTrade({ ...newTrade, portfolioId: e.target.value })}
              label="Portfolio"
            >
              {portfolios.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Asset</InputLabel>
            <Select
              value={newTrade.assetId}
              onChange={(e) => {
                const asset = assets.find((a) => a.id === e.target.value);
                setNewTrade({
                  ...newTrade,
                  assetId: e.target.value,
                  price: asset ? parseFloat(asset.currentPrice) : 0
                });
              }}
              label="Asset"
            >
              {assets.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.symbol} - {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Trade Type</InputLabel>
            <Select
              value={newTrade.tradeType}
              onChange={(e) => setNewTrade({ ...newTrade, tradeType: e.target.value })}
              label="Trade Type"
            >
              <MenuItem value="BUY">Buy</MenuItem>
              <MenuItem value="SELL">Sell</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newTrade.quantity}
            onChange={(e) => setNewTrade({ ...newTrade, quantity: parseFloat(e.target.value) })}
          />

          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newTrade.price}
            onChange={(e) => setNewTrade({ ...newTrade, price: parseFloat(e.target.value) })}
          />

          <TextField
            margin="dense"
            label="Fees"
            type="number"
            fullWidth
            value={newTrade.fees}
            onChange={(e) => setNewTrade({ ...newTrade, fees: parseFloat(e.target.value) })}
          />

          <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
            <Typography variant="body2" color="textSecondary">
              Total Amount
            </Typography>
            <Typography variant="h6">
              {formatCurrency(newTrade.quantity * newTrade.price + newTrade.fees)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTrade} variant="contained">
            Create Trade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
