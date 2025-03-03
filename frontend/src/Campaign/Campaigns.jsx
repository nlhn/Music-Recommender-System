import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCreateCampaignMutation } from "../api";
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
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

const Campaigns = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [openDialog, setOpenDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    dueDate: dayjs(),
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("token") || !userId) {
      navigate("/login");
    }
  }, [navigate, userId]);

  // Mock data for campaigns - in a real app, this would come from the API
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Weekly Recommendations",
      dueDate: "2023-12-31",
      recommendationCount: 15,
    },
    {
      id: 2,
      name: "Rock Classics",
      dueDate: "2023-11-15",
      recommendationCount: 8,
    },
    {
      id: 3,
      name: "Summer Hits",
      dueDate: "2023-08-31",
      recommendationCount: 12,
    },
  ]);

  const [createCampaign, { isLoading }] = useCreateCampaignMutation();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCampaign({
      name: "",
      dueDate: dayjs(),
    });
  };

  const handleInputChange = (e) => {
    setNewCampaign({
      ...newCampaign,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setNewCampaign({
      ...newCampaign,
      dueDate: date,
    });
  };

  const handleCreateCampaign = async () => {
    try {
      const result = await createCampaign({
        groupId,
        campaignData: {
          ...newCampaign,
          dueDate: newCampaign.dueDate.format("YYYY-MM-DD"),
        },
      }).unwrap();

      // Add new campaign to the list
      setCampaigns([
        ...campaigns,
        {
          id: result.id,
          name: newCampaign.name,
          dueDate: newCampaign.dueDate.format("YYYY-MM-DD"),
          recommendationCount: 0,
        },
      ]);

      handleCloseDialog();
    } catch (err) {
      // Handle error (ideally show in UI)
      console.error("Failed to create campaign:", err);
    }
  };

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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              sx={{ mr: 1 }}
              onClick={() => navigate(`/groups/${groupId}`)}
              aria-label="back to group"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              <MusicNoteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Campaigns
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            New Campaign
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
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
                  <Typography variant="body2" color="text.secondary">
                    Due Date: {campaign.dueDate}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Recommendations: {campaign.recommendationCount}
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
        </Grid>

        {/* Create Campaign Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create a new recommendation campaign to get song suggestions from
              group members.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Campaign Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newCampaign.name}
              onChange={handleInputChange}
              sx={{ mb: 2, mt: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={newCampaign.dueDate}
                onChange={handleDateChange}
                sx={{ width: "100%" }}
                minDate={dayjs()}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleCreateCampaign}
              variant="contained"
              disabled={isLoading || !newCampaign.name}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Campaigns;
