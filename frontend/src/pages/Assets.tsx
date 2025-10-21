import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
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
  IconButton,
  Grid
} from '@mui/material';
import { Add, Edit, TrendingUp } from '@mui/icons-material';
import { assetApi } from '../services/api';

const ASSET_TYPES = [
  'STOCK',
  'BOND',
  'ETF',
  'OPTION',
  'FUTURE',
  'FOREX',
  'CRYPTO',
  'COMMODITY',
  'REAL_ESTATE',
  'PRIVATE_EQUITY'
];

export default function Assets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    assetType: 'STOCK',
    sector: '',
    currentPrice: 0,
    currency: 'USD',
    exchange: ''
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const response = await assetApi.getAll();
      setAssets(response.data.data);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const handleSaveAsset = async () => {
    try {
      if (editingAsset) {
        await assetApi.update(editingAsset.id, formData);
      } else {
        await assetApi.create(formData);
      }
      setOpenDialog(false);
      setEditingAsset(null);
      setFormData({
        symbol: '',
        name: '',
        assetType: 'STOCK',
        sector: '',
        currentPrice: 0,
        currency: 'USD',
        exchange: ''
      });
      loadAssets();
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    setFormData({
      symbol: asset.symbol,
      name: asset.name,
      assetType: asset.assetType,
      sector: asset.sector || '',
      currentPrice: parseFloat(asset.currentPrice),
      currency: asset.currency,
      exchange: asset.exchange || ''
    });
    setOpenDialog(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getAssetTypeColor = (type: string) => {
    const colors: any = {
      STOCK: 'primary',
      BOND: 'secondary',
      ETF: 'info',
      CRYPTO: 'warning',
      COMMODITY: 'success'
    };
    return colors[type] || 'default';
  };

  // Group assets by type
  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.assetType]) {
      acc[asset.assetType] = [];
    }
    acc[asset.assetType].push(asset);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Assets
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
          Add Asset
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(assetsByType).map(([type, typeAssets]) => (
          <Grid item xs={12} sm={6} md={4} key={type}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {type}
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {typeAssets.length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  assets
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            All Assets
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Sector</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell>Exchange</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <Typography fontWeight={600}>{asset.symbol}</Typography>
                    </TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={asset.assetType}
                        color={getAssetTypeColor(asset.assetType) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{asset.sector || '-'}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                        <TrendingUp fontSize="small" color="success" />
                        <Typography fontWeight={600}>
                          {formatCurrency(parseFloat(asset.currentPrice))}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{asset.exchange || '-'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEdit(asset)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Symbol"
            fullWidth
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Asset Type</InputLabel>
            <Select
              value={formData.assetType}
              onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
              label="Asset Type"
            >
              {ASSET_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Sector"
            fullWidth
            value={formData.sector}
            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Current Price"
            type="number"
            fullWidth
            value={formData.currentPrice}
            onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Exchange"
            fullWidth
            value={formData.exchange}
            onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAsset} variant="contained">
            {editingAsset ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
