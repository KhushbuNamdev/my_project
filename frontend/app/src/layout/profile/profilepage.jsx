



import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Avatar,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  updateProfile,
  changePassword,
} from "../../Slice/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading: userLoading } = useSelector(
    (state) => state.user
  );

  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
      setPhoneNumber(currentUser.phoneNumber || "");
    }
  }, [currentUser]);

  if (userLoading || !currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography sx={{ color: "#000" }}>Loading...</Typography>
      </Box>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (editMode) {
        await dispatch(updateProfile({ email, phoneNumber }));
        setMessage("Profile updated successfully");
      }

      if (showPasswordFields) {
        if (!currentPassword)
          throw new Error("Please enter your current password");
        if (!newPassword) throw new Error("Please enter a new password");

        const resultAction = await dispatch(
          changePassword({ currentPassword, newPassword })
        );

        if (changePassword.rejected.match(resultAction)) {
          throw new Error(resultAction.payload || "Failed to update password");
        }

        setMessage("Password updated successfully ✔");

        setCurrentPassword(newPassword);
        setNewPassword("");
      }

      await dispatch(fetchCurrentUser());

      setTimeout(() => {
        setEditMode(false);
      }, 1200);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setShowPasswordFields(false);
    setCurrentPassword("");
    setNewPassword("");
    setError("");
    setMessage("");
    setEmail(currentUser.email);
    setPhoneNumber(currentUser.phoneNumber || "");
  };

  const handleCancelPassword = () => {
    setShowPasswordFields(false);
    setCurrentPassword("");
    setNewPassword("");
    setError("");
    setMessage("");
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      <Card
        sx={{
          p: 3,
          background: "transparent",
          backdropFilter: "blur(12px)",
          borderRadius: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }} display="flex" alignItems="center">
            <Avatar
              src={
                currentUser?.avatar ||
                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
              }
              sx={{ width: 100, height: 100, border: "3px solid white", mr: 3 }}
            />
            <Box>
              <Typography variant="h5" sx={{ color: "#000" }}>
                {currentUser?.name}
              </Typography>
              <Typography sx={{ color: "#000", opacity: 0.7 }}>
                {currentUser?.email}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }} display="flex" justifyContent="flex-end">
            {!editMode ? (
              <Button
                variant="contained"
                sx={{ bgcolor: "#6c5ce7" }}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#00b894" }}
                  onClick={handleSave}
                >
                  Save
                </Button>

                <Button variant="outlined" color="error" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, md: 12 }}>
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

              {editMode && (
                <Button
                  variant="text"
                  sx={{ color: "#000", textDecoration: "underline" }}
                  onClick={() => setShowPasswordFields((prev) => !prev)}
                >
                  Change Password
                </Button>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
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
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography sx={{ fontWeight: "bold", color: "#000" }}>
                  Role
                </Typography>
                <Typography sx={{ color: "#000" }}>
                  {currentUser?.role}
                </Typography>
              </Grid>

              {showPasswordFields && editMode && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" sx={{ mt: 1, mb: 2, color: "#000" }}>
                    Change Password
                  </Typography>
<TextField
  fullWidth
  type={showCurrentPassword ? "text" : "password"}
  label="Current Password"
  value={currentPassword}
  onChange={(e) => setCurrentPassword(e.target.value)}
  sx={{ mb: 2 }}
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowCurrentPassword((prev) => !prev)}
          >
            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }
  }}
/>



             <TextField
  fullWidth
  type={showNewPassword ? "text" : "password"}
  label="New Password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  sx={{ mb: 2 }}
  slotProps={{
      input: {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowNewPassword((prev) => !prev)}>
          {showNewPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
    },
  }}
/>
     

                  {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                      {error}
                    </Typography>
                  )}
                  {message && (
                    <Typography color="success.main" sx={{ mb: 2 }}>
                      {message}
                    </Typography>
                  )}

                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleCancelPassword}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

