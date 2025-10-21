import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  ShowChart,
  Assessment
} from '@mui/icons-material';
import { analyticsApi } from '../services/api';

interface DashboardData {
  totalAUM: number;
  totalPortfolios: number;
  totalPositions: number;
  portfolios: any[];
  recentTrades: any[];
}

const StatCard = ({ title, value, icon, color }: any) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: color,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await analyticsApi.getDashboard();
      setData(response.data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total AUM"
            value={formatCurrency(data.totalAUM)}
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Portfolios"
            value={data.totalPortfolios}
            icon={<AccountBalance sx={{ color: 'white' }} />}
            color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Positions"
            value={data.totalPositions}
            icon={<ShowChart sx={{ color: 'white' }} />}
            color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Risk Score"
            value="Medium"
            icon={<Assessment sx={{ color: 'white' }} />}
            color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Portfolios Overview
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="right">Positions</TableCell>
                      <TableCell align="right">P&L</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.portfolios.map((portfolio) => (
                      <TableRow key={portfolio.id}>
                        <TableCell>{portfolio.name}</TableCell>
                        <TableCell align="right">{formatCurrency(portfolio.totalValue)}</TableCell>
                        <TableCell align="right">{portfolio.positionsCount}</TableCell>
                        <TableCell align="right">
                          <Typography
                            color={portfolio.unrealizedPnL >= 0 ? 'success.main' : 'error.main'}
                            fontWeight={600}
                          >
                            {formatCurrency(portfolio.unrealizedPnL)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Recent Trades
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recentTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{trade.asset?.symbol}</TableCell>
                        <TableCell>
                          <Chip
                            label={trade.tradeType}
                            color={trade.tradeType === 'BUY' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{parseFloat(trade.quantity).toFixed(2)}</TableCell>
                        <TableCell align="right">${parseFloat(trade.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
