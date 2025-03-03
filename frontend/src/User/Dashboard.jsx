import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGetUserQuery, useGetUserRecommendationsQuery } from "../api";
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("token") || !userId) {
      navigate("/login");
    }
  }, [navigate, userId]);

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserQuery(userId, {
    skip: !userId,
  });

  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
    error: recommendationsError,
  } = useGetUserRecommendationsQuery(userId, {
    skip: !userId,
  });

  // Maps for instrument and proficiency display
  const instrumentNames = {
    0: "Guitar",
    1: "Bass",
    2: "Drums",
    3: "Piano",
  };

  const proficiencyNames = {
    0: "Beginner",
    1: "Intermediate",
    2: "Advanced",
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (isUserLoading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (userError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading user data:{" "}
          {userError.data?.message || "Please try again later"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Dashboard
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {userData && (
          <Grid container spacing={4}>
            {/* User Profile */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={userData.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Instrument"
                        secondary={
                          instrumentNames[userData.instrument] ||
                          "Not specified"
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Proficiency"
                        secondary={
                          proficiencyNames[userData.proficiency] ||
                          "Not specified"
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Group Section */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <GroupIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Your Groups
                  </Typography>
                  {userData.groups && userData.groups.length > 0 ? (
                    <List>
                      {userData.groups.map((group) => (
                        <ListItem key={group.id}>
                          <ListItemText
                            primary={group.name}
                            secondary={group.description || "No description"}
                          />
                          <Button
                            component={Link}
                            to={`/groups/${group.id}`}
                            variant="outlined"
                            size="small"
                          >
                            View
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      You haven't joined any groups yet.
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to="/groups"
                    variant="contained"
                    fullWidth
                  >
                    View All Groups
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Recommendations Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <MusicNoteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Your Music Recommendations
                  </Typography>

                  {isRecommendationsLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", my: 2 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : recommendationsError ? (
                    <Alert severity="error" sx={{ my: 2 }}>
                      Error loading recommendations
                    </Alert>
                  ) : recommendations && recommendations.length > 0 ? (
                    <Grid container spacing={2}>
                      {recommendations.map((recommendation) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          key={recommendation.id}
                        >
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6">
                                {recommendation.song.name}
                              </Typography>
                              <Typography color="text.secondary">
                                {recommendation.song.album.artist.name}
                              </Typography>
                              <Typography variant="body2">
                                Album: {recommendation.song.album.name}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No recommendations available yet. Join a group to get
                      personalized recommendations!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
