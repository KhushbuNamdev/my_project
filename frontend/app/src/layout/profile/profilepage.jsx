


import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Avatar,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, updateProfile } from "../../Slice/userSlice";
import background from "../../assets/background.png";
const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);

  const [editMode, setEditMode] = useState(false);

  // Local state
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Sync local state with currentUser
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
      setPhoneNumber(currentUser.phoneNumber || "");
    }
  }, [currentUser]);

  if (loading || !currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography sx={{ color: "#000" }}>Loading...</Typography>
      </Box>
    );
  }

  // 🔥 FIXED: UI auto-updates by refetching user after update
  const handleSave = async () => {
    await dispatch(updateProfile({ email, phoneNumber }));
    await dispatch(fetchCurrentUser()); // 🔥 Refresh UI with latest backend data
    setEditMode(false);
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* <Box
        sx={{
          width: "100%",
          height: 220,
          borderRadius: 2,
          overflow: "hidden",
          mb: -7,
             backgroundImage: `url(${background})`,
        }}
      >
        {/* <img
          src="https://images.unsplash.com/photo-1497215842964-222b430dc094"
          alt="cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        /> */}

      {/* HEADER CARD */}
      <Card
        sx={{
          p: 3,
          // background: "rgba(179, 179, 179, 0.15)",
          background:"transparent",
          backdropFilter: "blur(12px)",
          borderRadius: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} md={8} display="flex" alignItems="center">
            <Avatar
              src={
                currentUser?.avatar ||
                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
              }
              sx={{
                width: 100,
                height: 100,
                border: "3px solid white",
                mr: 3,
              }}
            />

            <Box   >   
              <Typography variant="h5" sx={{ color: "#000" }}>
                {currentUser?.name}
              </Typography>
              <Typography sx={{ color: "#000", opacity: 0.7 }}>
                {currentUser?.email}
              </Typography>
            </Box>
          </Grid>

          <Grid
           size={{xs:12 , md:12}}
            display="flex"
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            gap={1}
          
          >
            {!editMode ? (
              <Button
                variant="contained"
                sx={{ bgcolor: "#6c5ce7" }}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ bgcolor: "#00b894" }}
                onClick={handleSave}
              >
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </Card>

      {/* DETAILS SECTION */}
      <Grid container spacing={3} mt={2}   sx={{  background: "rgba(255, 255, 255, 0.15)",}}>
        <Grid size={{xs:12 , md:12}}>
          <Card
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" sx={{ color: "#000" }}>
                Profile Details
              </Typography>
            </Box>

            <Grid container spacing={3}>
          
              <Grid size={{xs:12 , md:6}}>
                <Typography sx={{ fontWeight: "bold", color: "#000" }}>
                  Email
                </Typography>

                {!editMode ? (
                  <Typography sx={{ color: "#000" }}>
                    {currentUser?.email}
                  </Typography>
                ) : (
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </Grid>

              {/* PHONE NUMBER */}
                       <Grid size={{xs:12 , md:6}}>
                <Typography sx={{ fontWeight: "bold", color: "#000" }}>
                  Phone Number
                </Typography>

                {!editMode ? (
                  <Typography sx={{ color: "#000" }}>
                    {currentUser?.phoneNumber || "N/A"}
                  </Typography>
                ) : (
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                )}
              </Grid>

              <Grid size={{xs:12 , md:6}}>
                <Typography sx={{ fontWeight: "bold", color: "#000" }}>
                  Role
                </Typography>
                <Typography sx={{ color: "#000" }}>
                  {currentUser?.role}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;