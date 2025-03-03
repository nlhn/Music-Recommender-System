import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreateGroupMutation } from "../api";
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";

const Groups = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [open, setOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Mock data for groups - in a real app, you would fetch this from the API
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Rock Enthusiasts",
      description: "A group for rock music lovers",
      memberCount: 15,
    },
    {
      id: 2,
      name: "Jazz Club",
      description: "For jazz aficionados and musicians",
      memberCount: 8,
    },
    {
      id: 3,
      name: "Blues Travelers",
      description: "Exploring the world of blues music",
      memberCount: 12,
    },
  ]);

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("token") || !userId) {
      navigate("/login");
    }
  }, [navigate, userId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewGroup({ name: "", description: "" });
  };

  const handleChange = (e) => {
    setNewGroup({
      ...newGroup,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateGroup = async () => {
    try {
      const result = await createGroup({
        userId,
        groupData: newGroup,
      }).unwrap();

      // Add the new group to the list
      setGroups([
        ...groups,
        {
          id: result.id,
          name: newGroup.name,
          description: newGroup.description,
          memberCount: 1,
        },
      ]);

      setSnackbar({
        open: true,
        message: "Group created successfully!",
        severity: "success",
      });

      handleClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.data?.message || "Failed to create group",
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
            <GroupIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Music Groups
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Create Group
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {group.description}
                  </Typography>
                  <Typography variant="body2">
                    Members: {group.memberCount}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/groups/${group.id}`}
                    variant="outlined"
                    fullWidth
                  >
                    View Group
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Create Group Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create a new music group where members can share and receive music
              recommendations.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Group Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newGroup.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={newGroup.description}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleCreateGroup}
              variant="contained"
              disabled={isLoading || !newGroup.name}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
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

export default Groups;
