import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper
} from '@mui/material';
import { portfolioApi, analyticsApi } from '../services/api';

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [allocation, setAllocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPortfolioData();
    }
  }, [id]);

  const loadPortfolioData = async () => {
    try {
      const [portfolioRes, performanceRes, allocationRes] = await Promise.all([
        portfolioApi.getById(id!),
        analyticsApi.getPerformance(id!),
        analyticsApi.getAllocation(id!)
      ]);

      setPortfolio(portfolioRes.data.data);
      setPerformance(performanceRes.data.data);
      setAllocation(allocationRes.data.data);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!portfolio) {
    return <Typography>Portfolio not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        {portfolio.name}
      </Typography>
      <Typography color="textSecondary" paragraph>
        {portfolio.description}
      </Typography>

      {performance && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Total Value
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatCurrency(performance.totalValue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Total Return
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color={performance.returnPercentage >= 0 ? 'success.main' : 'error.main'}
                >
                  {performance.returnPercentage.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Unrealized P&L
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color={performance.unrealizedPnL >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(performance.unrealizedPnL)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Cash Balance
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatCurrency(performance.cashBalance)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Positions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Asset Type</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Avg Price</TableCell>
                      <TableCell align="right">Current Value</TableCell>
                      <TableCell align="right">P&L</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {portfolio.positions?.map((position: any) => (
                      <TableRow key={position.id}>
                        <TableCell>
                          <Typography fontWeight={600}>{position.asset.symbol}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {position.asset.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={position.asset.assetType} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          {parseFloat(position.quantity).toFixed(4)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(parseFloat(position.averagePrice))}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(parseFloat(position.currentValue))}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            color={
                              parseFloat(position.unrealizedPnL) >= 0
                                ? 'success.main'
                                : 'error.main'
                            }
                            fontWeight={600}
                          >
                            {formatCurrency(parseFloat(position.unrealizedPnL))}
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

        <Grid item xs={12} md={4}>
          {allocation && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Asset Allocation
                </Typography>
                {Object.entries(allocation.byAssetType).map(([type, data]: any) => (
                  <Box key={type} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">{type}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {data.percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 8,
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        mt: 0.5,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          bgcolor: 'primary.main',
                          width: `${data.percentage}%`
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
