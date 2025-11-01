import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Box } from '@mui/material';
import {
  Circle as DiceIcon,
  ViewCarousel as SlotsIcon,
  Album as RouletteIcon,
  Style as BlackjackIcon
} from '@mui/icons-material';

const games = [
  {
    name: 'Dice',
    icon: DiceIcon,
    path: '/dice',
    description: 'Roll the dice and test your luck with adjustable odds',
    color: '#00e599'
  },
  {
    name: 'Slots',
    icon: SlotsIcon,
    path: '/slots',
    description: '5-reel slot machine with multiple paylines',
    color: '#7F3FF2'
  },
  {
    name: 'Roulette',
    icon: RouletteIcon,
    path: '/roulette',
    description: 'European roulette with multiple betting options',
    color: '#FF4C5A'
  },
  {
    name: 'Blackjack',
    icon: BlackjackIcon,
    path: '/blackjack',
    description: 'Classic blackjack with hit, stand, and more',
    color: '#FFA500'
  }
];

export default function Casino() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Casino Games
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose your game and start playing!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={3} key={game.name}>
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
              <CardActionArea
                onClick={() => navigate(game.path)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    <game.icon sx={{ fontSize: 64, color: game.color }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {game.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {game.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Provably Fair Gaming
        </Typography>
        <Typography variant="body1" color="text.secondary">
          All our games use provably fair technology, ensuring every bet result is verifiable and
          transparent. Each game uses cryptographic seeds to generate random results that can be
          independently verified.
        </Typography>
      </Box>
    </Container>
  );
}
