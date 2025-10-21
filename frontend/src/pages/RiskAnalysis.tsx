import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip
} from '@mui/material';
import { Warning, Assessment, TrendingDown } from '@mui/icons-material';
import { portfolioApi, riskApi } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function RiskAnalysis() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const [riskData, setRiskData] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPortfolios();
  }, []);

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

  const analyzeRisk = async () => {
    if (!selectedPortfolio) return;

    setLoading(true);
    try {
      const [riskRes, scenarioRes] = await Promise.all([
        riskApi.analyzePortfolio(selectedPortfolio),
        riskApi.runScenarios(selectedPortfolio)
      ]);

      setRiskData(riskRes.data.data);
      setScenarios(scenarioRes.data.data);
    } catch (error) {
      console.error('Error analyzing risk:', error);
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

  const getRiskLevel = (beta: number) => {
    if (beta < 0.8) return { label: 'Low', color: 'success' };
    if (beta < 1.2) return { label: 'Medium', color: 'warning' };
    return { label: 'High', color: 'error' };
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Risk Analysis
      </Typography>

      <Box display="flex" gap={2} alignItems="center" sx={{ mb: 3 }}>
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
        <Button variant="contained" onClick={analyzeRisk} disabled={!selectedPortfolio}>
          Analyze Risk
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {riskData && !loading && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Warning color="warning" />
                    <Typography color="textSecondary" variant="body2">
                      VaR (95%)
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {formatCurrency(riskData.var95)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Maximum expected loss
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Assessment color="primary" />
                    <Typography color="textSecondary" variant="body2">
                      Sharpe Ratio
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {riskData.sharpeRatio.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Risk-adjusted return
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <TrendingDown color="error" />
                    <Typography color="textSecondary" variant="body2">
                      Volatility
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {(riskData.volatility * 100).toFixed(2)}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Portfolio volatility
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" variant="body2" mb={1}>
                    Risk Level
                  </Typography>
                  <Chip
                    label={getRiskLevel(riskData.beta).label}
                    color={getRiskLevel(riskData.beta).color as any}
                    sx={{ fontSize: '1.2rem', py: 2.5, px: 1 }}
                  />
                  <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                    Beta: {riskData.beta.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Exposure by Asset Type
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={Object.entries(riskData.exposureByAssetType).map(([type, value]) => ({
                        name: type,
                        exposure: parseFloat(value as string)
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="exposure" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Risk Metrics Summary
                  </Typography>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>VaR (99%)</TableCell>
                        <TableCell align="right">{formatCurrency(riskData.var99)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Max Drawdown</TableCell>
                        <TableCell align="right">
                          {(riskData.maxDrawdown * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Concentration (HHI)</TableCell>
                        <TableCell align="right">{riskData.concentration.toFixed(4)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Beta</TableCell>
                        <TableCell align="right">{riskData.beta.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {scenarios.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Scenario Analysis
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Stress testing portfolio against various market scenarios
                </Alert>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Scenario</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Impact</TableCell>
                        <TableCell align="right">Impact %</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scenarios.map((scenario, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography fontWeight={600}>{scenario.scenario}</Typography>
                          </TableCell>
                          <TableCell>{scenario.description}</TableCell>
                          <TableCell align="right">
                            <Typography
                              color={scenario.impact >= 0 ? 'success.main' : 'error.main'}
                              fontWeight={600}
                            >
                              {formatCurrency(scenario.impact)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              color={scenario.impactPercentage >= 0 ? 'success.main' : 'error.main'}
                              fontWeight={600}
                            >
                              {scenario.impactPercentage.toFixed(2)}%
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
