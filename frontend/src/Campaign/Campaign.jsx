import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useGetCampaignQuery,
  useRateCampaignRecommendationMutation,
} from "../api";
import {
  Box,
  Typography,
  Paper,
  Container,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Rating,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  Snackbar,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const Campaign = () => {
  const { groupId, campaignId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("token") || !userId) {
      navigate("/login");
    }
  }, [navigate, userId]);

  const {
    data: campaign,
    isLoading,
    error,
  } = useGetCampaignQuery(
    { groupId, campaignId },
    {
      skip: !groupId || !campaignId,
    }
  );

  const [rateCampaignRecommendation] = useRateCampaignRecommendationMutation();

  // Mock campaign data
  const [campaignData, setCampaignData] = useState({
    id: parseInt(campaignId),
    name: "Weekly Recommendations",
    dueDate: "2023-12-31",
    groupName: "Rock Enthusiasts",
    recommendations: [
      {
        id: 1,
        song: {
          id: 101,
          name: "Stairway to Heaven",
          album: {
            id: 201,
            name: "Led Zeppelin IV",
            artist: {
              id: 301,
              name: "Led Zeppelin",
            },
          },
        },
        userRating: 4,
      },
      {
        id: 2,
        song: {
          id: 102,
          name: "Sweet Child O' Mine",
          album: {
            id: 202,
            name: "Appetite for Destruction",
            artist: {
              id: 302,
              name: "Guns N' Roses",
            },
          },
        },
        userRating: 3,
      },
      {
        id: 3,
        song: {
          id: 103,
          name: "Nothing Else Matters",
          album: {
            id: 203,
            name: "Metallica (The Black Album)",
            artist: {
              id: 303,
              name: "Metallica",
            },
          },
        },
        userRating: null,
      },
    ],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRating = async (recommendationId, newRating) => {
    try {
      await rateCampaignRecommendation({
        userId,
        recommendationId,
        ratingData: { rating: newRating },
      }).unwrap();

      // Update local state to reflect the new rating
      setCampaignData((prevData) => ({
        ...prevData,
        recommendations: prevData.recommendations.map((rec) =>
          rec.id === recommendationId ? { ...rec, userRating: newRating } : rec
        ),
      }));

      // Show success message
      setSnackbar({
        open: true,
        message: "Rating saved successfully!",
        severity: "success",
      });
    } catch (err) {
      // Handle error
      console.error("Failed to rate recommendation:", err);
      setSnackbar({
        open: true,
        message: "Failed to save rating. Please try again.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Get placeholder album art (in a real app, this would come from an API or database)
  const getAlbumArtUrl = (songId) => {
    return `https://picsum.photos/seed/${songId}/300/300`;
  };

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading campaign:{" "}
          {error.data?.message || "Please try again later"}
        </Alert>
      </Container>
    );
  }

  const ratedRecommendations = campaignData.recommendations.filter(
    (rec) => rec.userRating !== null
  );
  const unratedRecommendations = campaignData.recommendations.filter(
    (rec) => rec.userRating === null
  );

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <IconButton
            sx={{ mr: 1 }}
            onClick={() => navigate(`/groups/${groupId}/campaigns`)}
            aria-label="back to campaigns"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            <MusicNoteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {campaignData.name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", ml: 5, mb: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mr: 2 }}>
            Group: {campaignData.groupName}
          </Typography>
          <Chip
            icon={<ScheduleIcon />}
            label={`Due: ${campaignData.dueDate}`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ width: "100%", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              label={`ALL RECOMMENDATIONS (${campaignData.recommendations.length})`}
            />
            <Tab label={`TO RATE (${unratedRecommendations.length})`} />
            <Tab label={`RATED (${ratedRecommendations.length})`} />
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {(tabValue === 0
            ? campaignData.recommendations
            : tabValue === 1
            ? unratedRecommendations
            : ratedRecommendations
          ).map((recommendation) => (
            <Grid item xs={12} sm={6} md={4} key={recommendation.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ height: 180 }}
                  image={getAlbumArtUrl(recommendation.song.id)}
                  alt={recommendation.song.album.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {recommendation.song.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Artist: {recommendation.song.album.artist.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Album: {recommendation.song.album.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography component="legend" sx={{ mr: 1 }}>
                      Your Rating:
                    </Typography>
                    <Rating
                      name={`rating-${recommendation.id}`}
                      value={recommendation.userRating || 0}
                      onChange={(event, newValue) => {
                        handleRating(recommendation.id, newValue);
                      }}
                      emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      icon={<StarIcon fontSize="inherit" />}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Tooltip title="Play sample (mock)">
                    <IconButton
                      color="primary"
                      aria-label={`play ${recommendation.song.name}`}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    // In a real app, this might link to a details page
                    to={`#song-details-${recommendation.song.id}`}
                  >
                    More Info
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Campaign;
