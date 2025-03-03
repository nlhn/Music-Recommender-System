import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetGroupQuery, useJoinGroupMutation } from "../api";
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
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Group = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [tabValue, setTabValue] = useState(0);
  const [shareDialog, setShareDialog] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("token") || !userId) {
      navigate("/login");
    }
  }, [navigate, userId]);

  const {
    data: group,
    isLoading,
    error,
  } = useGetGroupQuery(groupId, {
    skip: !groupId,
  });

  // Mock data for group details - in a real app, this would come from the API
  const [groupData, setGroupData] = useState({
    id: parseInt(groupId),
    name: "Rock Enthusiasts",
    description:
      "A group for rock music lovers and musicians to share their favorite tracks and collaborate.",
    inviteCode: "ROCK123",
    isAdmin: false,
    members: [
      {
        id: 1,
        email: "john@example.com",
        instrument: "Guitar",
        proficiency: "Advanced",
      },
      {
        id: 2,
        email: "alice@example.com",
        instrument: "Bass",
        proficiency: "Intermediate",
      },
      {
        id: 3,
        email: "bob@example.com",
        instrument: "Drums",
        proficiency: "Beginner",
      },
    ],
    campaigns: [
      { id: 1, name: "Weekly Recommendations", dueDate: "2023-12-31" },
      { id: 2, name: "Rock Classics", dueDate: "2023-11-15" },
    ],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleShareDialogOpen = () => {
    setShareDialog(true);
  };

  const handleShareDialogClose = () => {
    setShareDialog(false);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(groupData.inviteCode);
    // You would typically show a snackbar or alert here
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
          Error loading group data:{" "}
          {error.data?.message || "Please try again later"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <IconButton
            sx={{ mr: 1 }}
            onClick={() => navigate("/groups")}
            aria-label="back to groups"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            <GroupIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {groupData.name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Share Group Invite Code">
            <IconButton
              aria-label="share group"
              onClick={handleShareDialogOpen}
              color="primary"
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body1" sx={{ ml: 5, mb: 3 }}>
          {groupData.description}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ width: "100%", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab icon={<PersonIcon />} label="MEMBERS" />
            <Tab icon={<MusicNoteIcon />} label="CAMPAIGNS" />
          </Tabs>
        </Box>

        {/* Members Tab */}
        {tabValue === 0 && (
          <List>
            {groupData.members.map((member) => (
              <ListItem key={member.id} divider>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.email}
                  secondary={`${member.instrument} (${member.proficiency})`}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Campaigns Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            {groupData.campaigns.map((campaign) => (
              <Grid item xs={12} sm={6} md={4} key={campaign.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {campaign.name}
                    </Typography>
                    <Typography variant="body2">
                      Due Date: {campaign.dueDate}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={Link}
                      to={`/groups/${groupId}/campaigns/${campaign.id}`}
                      variant="outlined"
                      fullWidth
                    >
                      View Campaign
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/groups/${groupId}/campaigns/new`)}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <MusicNoteIcon
                    sx={{ fontSize: 40, mb: 2, color: "primary.main" }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Create New Campaign
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Share Dialog */}
        <Dialog open={shareDialog} onClose={handleShareDialogClose}>
          <DialogTitle>Share Group Invitation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Share this invite code with friends to allow them to join this
              group:
            </DialogContentText>
            <TextField
              margin="dense"
              id="inviteCode"
              label="Invite Code"
              type="text"
              fullWidth
              variant="outlined"
              value={groupData.inviteCode}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleShareDialogClose}>Close</Button>
            <Button onClick={copyInviteCode} variant="contained">
              Copy Code
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Group;
