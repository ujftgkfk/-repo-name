import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Chip,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { providerApi } from '../services/api';

const USER_ID = 1;

export default function ProviderGames() {
  const [providers, setProviders] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [providersRes, gamesRes] = await Promise.all([
        providerApi.getAllProviders(),
        selectedCategory === 'popular'
          ? providerApi.getPopularGames(50)
          : providerApi.getAllGames({
              category: selectedCategory !== 'all' ? selectedCategory : undefined,
              search: searchQuery || undefined,
              limit: 50
            })
      ]);

      setProviders(providersRes.data.providers || []);
      setGames(gamesRes.data.games || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchGame = async (gameId: number, hasDemo: boolean) => {
    try {
      const response = await providerApi.launchGame(USER_ID, gameId, hasDemo);

      // Open game in new window
      window.open(response.data.gameUrl, '_blank', 'width=1280,height=720');
    } catch (error: any) {
      console.error('Error launching game:', error);
      alert(error.response?.data?.error || 'Failed to launch game');
    }
  };

  const categories = [
    { value: 'all', label: 'All Games' },
    { value: 'popular', label: 'Popular' },
    { value: 'slots', label: 'Slots' },
    { value: 'live_casino', label: 'Live Casino' },
    { value: 'table_games', label: 'Table Games' },
    { value: 'jackpot', label: 'Jackpot' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Casino Games
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Play games from top providers
        </Typography>
      </Box>

      {/* Providers */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Providers
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {providers.map((provider) => (
            <Chip
              key={provider.id}
              label={provider.displayName}
              variant="outlined"
              sx={{
                height: 40,
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: '#fff'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Search and Categories */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((cat) => (
            <Tab key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Tabs>
      </Box>

      {/* Games Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : games.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No games found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {games.map((game: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  transition: 'all 0.3s'
                }}
              >
                <CardActionArea onClick={() => handleLaunchGame(game.id, game.hasDemo)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={game.thumbnail || 'https://via.placeholder.com/300x200?text=Game'}
                    alt={game.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                      {game.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={game.provider?.displayName || 'Unknown'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {game.rtp && (
                        <Typography variant="caption" color="text.secondary">
                          RTP: {game.rtp}%
                        </Typography>
                      )}
                    </Box>
                    {game.hasDemo && (
                      <Chip
                        label="DEMO"
                        size="small"
                        color="success"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
