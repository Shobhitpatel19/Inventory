import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import axios from "axios";

const getInitials = (name) => {
  return name ? name.charAt(0).toUpperCase() : "?";
};

const AssignDriverPopup = ({ open, onClose, onAssign, authApi, userToken }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${authApi}/user/members`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setMembers(res.data || []);
      } catch (err) {
        console.log("Failed to fetch members", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchMembers();
    }
  }, [open, authApi, userToken]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Assign Driver</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : members.length ? (
          <Grid container spacing={2}>
            {members.map((member) => (
              <Grid item xs={4} key={member.id}>
                <Card
                  onClick={() => onAssign(member)}
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    height: 140,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: "#1976d2", mb: 1 }}>
                    {getInitials(member.firstName)}
                  </Avatar>
                  <Typography variant="body1" fontWeight={600}>
                    {member.firstName}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No members found</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignDriverPopup;
  