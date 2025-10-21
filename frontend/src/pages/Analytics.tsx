import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { portfolioApi, analyticsApi } from '../services/api';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

export default function Analytics() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const [performance, setPerformance] = useState<any>(null);
  const [allocation, setAllocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPortfolios();
  }, []);

  useEffect(() => {
    if (selectedPortfolio) {
      loadAnalytics();
    }
  }, [selectedPortfolio]);

  const loadPortfolios = async () => {
    try {
      const response = await portfolioApi.getAll();
      setPortfolios(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedPortfolio(response.data.data[0].id);
      }
    } catch (error) {
      console.error('Error loading portfolios:', error);
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [performanceRes, allocationRes] = await Promise.all([
        analyticsApi.getPerformance(selectedPortfolio),
        analyticsApi.getAllocation(selectedPortfolio)
      ]);

      setPerformance(performanceRes.data.data);
      setAllocation(allocationRes.data.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
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

  const prepareAllocationData = (data: any) => {
    return Object.entries(data).map(([name, info]: any) => ({
      name,
      value: info.percentage,
      count: info.count
    }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Analytics
        </Typography>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Select Portfolio</InputLabel>
          <Select
            value={selectedPortfolio}
            onChange={(e) => setSelectedPortfolio(e.target.value)}
            label="Select Portfolio"
          >
            {portfolios.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {performance && !loading && (
        <>
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
                    Total Invested
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {formatCurrency(performance.totalInvested)}
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
                    color={performance.totalReturn >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(performance.totalReturn)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    Return %
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
          </Grid>

          {allocation && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Asset Type Allocation
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareAllocationData(allocation.byAssetType)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareAllocationData(allocation.byAssetType).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Sector Allocation
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareAllocationData(allocation.bySector)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                          outerRadius={80}
                          fill="#82ca9d"
                          dataKey="value"
                        >
                          {prepareAllocationData(allocation.bySector).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Top Holdings
                    </Typography>
                    {allocation.topHoldings.map((holding: any, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 2,
                          pb: 2,
                          borderBottom: index < allocation.topHoldings.length - 1 ? 1 : 0,
                          borderColor: 'divider'
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography fontWeight={600}>{holding.symbol}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {holding.name}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography fontWeight={600}>
                              {formatCurrency(holding.value)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {holding.percentage.toFixed(2)}%
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            mt: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              bgcolor: COLORS[index % COLORS.length],
                              width: `${holding.percentage}%`
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
