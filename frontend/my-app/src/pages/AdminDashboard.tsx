import React from "react";
import {
  useGetAllApisQuery,
  useGetApiByIdQuery,
  useCreateApiMutation,
} from "../services/api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { Api } from "../types";
import InfoIcon from "@mui/icons-material/Info";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddIcon from "@mui/icons-material/Add";

const AdminDashboard = () => {
  const {
    data: allApisResponse,
    isLoading: isApisLoading,
  } = useGetAllApisQuery();

  const [createApi] = useCreateApiMutation();

  const [selectedApiId, setSelectedApiId] = React.useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newApi, setNewApi] = React.useState({
    name: "",
    description: "",
    endpoint: "",
    method: "GET",
    pricePerRequest: 0,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateApi = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await createApi(newApi).unwrap();
      setIsCreateDialogOpen(false);
      setNewApi({
        name: "",
        description: "",
        endpoint: "",
        method: "GET",
        pricePerRequest: 0,
      });
    } catch (error: any) {
      setError(error.data?.message || "Failed to create API. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    data: apiDetailResponse,
    isLoading: isDetailLoading,
    error: apiDetailError
  } = useGetApiByIdQuery(selectedApiId ?? "", {
    skip: !selectedApiId,
  });

  const apis: Api[] =
    allApisResponse && Array.isArray(allApisResponse.data)
      ? allApisResponse.data
      : [];
  const api = apiDetailResponse?.data;

  // Analytics data
  const totalRevenue = apis.reduce((sum, api) => sum + (api.pricePerRequest * api.callCount), 0);
  const totalCalls = apis.reduce((sum, api) => sum + api.callCount, 0);
  const totalSubscribers = apis.reduce((sum, api) => sum + (api.subscribedUsers?.length || 0), 0);
  const activeApis = apis.filter(api => api.isActive).length;

  if (isApisLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create API
        </Button>
      </Box>

      {/* Analytics Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Box display="flex" alignItems="center" mb={1}>
              <MonetizationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Revenue</Typography>
            </Box>
            <Typography variant="h4">${totalRevenue.toFixed(2)}</Typography>
            <Typography color="textSecondary">From API calls</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Box display="flex" alignItems="center" mb={1}>
              <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Calls</Typography>
            </Box>
            <Typography variant="h4">{totalCalls}</Typography>
            <Typography color="textSecondary">API requests</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Box display="flex" alignItems="center" mb={1}>
              <PeopleIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Subscribers</Typography>
            </Box>
            <Typography variant="h4">{totalSubscribers}</Typography>
            <Typography color="textSecondary">Active users</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Box display="flex" alignItems="center" mb={1}>
              <InfoIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Active APIs</Typography>
            </Box>
            <Typography variant="h4">{activeApis}</Typography>
            <Typography color="textSecondary">Out of {apis.length}</Typography>
          </Paper>
        </Box>
      </Box>

      {/* API List */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        API Management
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {apis.map((api) => (
          <Box key={api._id} sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6">{api.name}</Typography>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => setSelectedApiId(api._id)} size="small">
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {api.description}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ flex: '1 1 120px' }}>
                    <Typography variant="body2" color="textSecondary">
                      Method: {api.method}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 120px' }}>
                    <Typography variant="body2" color="textSecondary">
                      Price: ${api.pricePerRequest}/request
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 120px' }}>
                    <Typography variant="body2" color="textSecondary">
                      Calls: {api.callCount}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 120px' }}>
                    <Typography variant="body2" color="textSecondary">
                      Status: {api.isActive ? "Active" : "Inactive"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Create API Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setError(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New API</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="API Name"
              value={newApi.name}
              onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
              fullWidth
              required
              error={!newApi.name}
              helperText={!newApi.name ? "API name is required" : ""}
            />
            <TextField
              label="Description"
              value={newApi.description}
              onChange={(e) => setNewApi({ ...newApi, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              required
              error={!newApi.description}
              helperText={!newApi.description ? "Description is required" : ""}
            />
            <TextField
              label="Endpoint"
              value={newApi.endpoint}
              onChange={(e) => setNewApi({ ...newApi, endpoint: e.target.value })}
              fullWidth
              required
              error={!newApi.endpoint}
              helperText={!newApi.endpoint ? "Endpoint is required" : ""}
            />
            <TextField
              select
              label="Method"
              value={newApi.method}
              onChange={(e) => setNewApi({ ...newApi, method: e.target.value })}
              fullWidth
              required
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </TextField>
            <TextField
              label="Price per Request"
              type="number"
              value={newApi.pricePerRequest}
              onChange={(e) => setNewApi({ ...newApi, pricePerRequest: Number(e.target.value) })}
              fullWidth
              required
              error={newApi.pricePerRequest < 0}
              helperText={newApi.pricePerRequest < 0 ? "Price cannot be negative" : ""}
              InputProps={{
                startAdornment: <Typography>$</Typography>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsCreateDialogOpen(false);
              setError(null);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateApi} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting || !newApi.name || !newApi.description || !newApi.endpoint || newApi.pricePerRequest < 0}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* API Details Dialog */}
      <Dialog
        open={!!selectedApiId}
        onClose={() => setSelectedApiId(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>API Details</DialogTitle>
        <DialogContent>
          {isDetailLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : apiDetailError ? (
            <Typography color="error">Error loading API details</Typography>
          ) : !api ? (
            <Typography>No API details found</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="h6">{api.name}</Typography>
                <Typography color="textSecondary" paragraph>
                  {api.description}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>API Information</Typography>
                    <Typography>Method: {api.method}</Typography>
                    <Typography>Endpoint: {api.endpoint}</Typography>
                    <Typography>Price per Request: ${api.pricePerRequest}</Typography>
                    <Typography>Total Calls: {api.callCount}</Typography>
                    <Typography>Status: {api.isActive ? "Active" : "Inactive"}</Typography>
                  </Paper>
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Subscription Details</Typography>
                    <Typography>Total Subscribers: {api.subscribedUsers?.length}</Typography>
                    <Typography>
                      Created: {new Date(api.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      Last Updated: {new Date(api.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedApiId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
