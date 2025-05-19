import React, { useMemo } from "react";
import { useMeQuery, useGetApiByIdQuery } from "../services/api";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

const UserDashboard = () => {
  const { data: meData, isLoading: isMeLoading, isError: isMeError } = useMeQuery();
console.log(meData)
  const subscribedApiIds = useMemo(() => {
    return meData?.data?.subscribedApis || [];
  }, [meData]);

  // Query first subscribed API details
  const { data: apiData, isLoading: isApiLoading } = useGetApiByIdQuery(subscribedApiIds[0], {
    skip: !subscribedApiIds.length,
  });

  if (isMeLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isMeError || !meData?.data) {
    return (
      <Box mt={4}>
        <Typography color="error">Failed to load user data.</Typography>
      </Box>
    );
  }

  const user = meData.data;
  const api = apiData?.data; // <-- corrected here

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}
      </Typography>

      <Box mb={3}>
        <Typography>Email: {user.email}</Typography>
        <Typography>Wallet: {user.credits} credits</Typography>
        <Typography>Role: {user.role}</Typography>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>
          Subscribed API Details
        </Typography>

        {isApiLoading ? (
          <Typography>Loading API details...</Typography>
        ) : api ? (
          <Card sx={{ minWidth: 250, mt: 2 }}>
            <CardContent>
              <Typography variant="h6">{api.name}</Typography>
              <Typography>Method: {api.method}</Typography>
              <Typography>Price: {api.pricePerRequest} credits</Typography>
              <Typography>Calls: {api.callCount}</Typography>
            </CardContent>
          </Card>
        ) : (
          <Typography>No API data found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default UserDashboard;
