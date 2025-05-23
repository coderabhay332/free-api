import React, { useMemo } from "react";
import { useMeQuery, useGetAllApisQuery } from "../services/api";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from "@mui/material";
import { ApiOutlined, WalletOutlined, BarChartOutlined } from '@ant-design/icons';

const UserDashboard = () => {
  const { data: meData, isLoading: isMeLoading, isError: isMeError } = useMeQuery();
  const { data: apisData } = useGetAllApisQuery();

  const analytics = useMemo(() => {
    if (!meData?.data?.subscribedApis || !apisData?.data) return null;
    
    const totalHits = meData.data.subscribedApis.reduce((sum, sub) => sum + (sub.hit || 0), 0);
    const totalSpent = meData.data.subscribedApis.reduce((sum, sub) => {
      const api = apisData.data.find(a => a._id === sub.api);
      return sum + ((sub.hit || 0) * (api?.pricePerRequest || 0));
    }, 0);

    return {
      totalHits,
      totalSpent,
      apis: meData.data.subscribedApis.map(sub => {
        const api = apisData.data.find(a => a._id === sub.api);
        return {
          name: api?.name || 'Unknown API',
          hits: sub.hit || 0,
          spent: (sub.hit || 0) * (api?.pricePerRequest || 0),
          pricePerRequest: api?.pricePerRequest || 0
        };
      })
    };
  }, [meData, apisData]);

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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}
      </Typography>
   
      <Box mb={3}>
        <Typography>Email: {user.email}</Typography>
        <Typography>Wallet: {user.credit} credits</Typography>
        <Typography>Role: {user.role}</Typography>
        {user.apiKey && (
          <Box mt={2}>
            <Typography variant="subtitle1">Your API Key:</Typography>
            <Typography variant="body2" sx={{ 
              fontFamily: 'monospace',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px',
              wordBreak: 'break-all'
            }}>
              {user.apiKey}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        API Analytics
      </Typography>

      {analytics && (
        <>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3, 
            mb: 4 
          }}>
            <Card sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <ApiOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                  <Typography variant="h6">Total APIs</Typography>
                </Box>
                <Typography variant="h4">{analytics.apis.length}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <BarChartOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                  <Typography variant="h6">Total Hits</Typography>
                </Box>
                <Typography variant="h4">{analytics.totalHits}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <WalletOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                  <Typography variant="h6">Total Spent</Typography>
                </Box>
                <Typography variant="h4">{analytics.totalSpent} credits</Typography>
              </CardContent>
            </Card>
          </Box>

          <Typography variant="h6" gutterBottom>
            API Usage Details
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2 
          }}>
            {analytics.apis.map((api, index) => (
              <Card key={index} sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                <CardContent>
                  <Typography variant="h6">{api.name}</Typography>
                  <Typography>Hits: {api.hits}</Typography>
                  <Typography>Spent: {api.spent} credits</Typography>
                  <Typography>Price per request: {api.pricePerRequest} credits</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserDashboard;
