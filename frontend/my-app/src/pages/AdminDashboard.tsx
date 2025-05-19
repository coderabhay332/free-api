import React from "react";
import {
  useGetAllApisQuery,
  useGetApiByIdQuery,
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
} from "@mui/material";
import { Api } from "../types";

const AdminDashboard = () => {
  const {
    data: allApisResponse,
    isLoading: isApisLoading,
  } = useGetAllApisQuery();

  const [selectedApiId, setSelectedApiId] = React.useState<string | null>(null);

 const {
  data: apiDetailResponse,
  isLoading: isDetailLoading,
} = useGetApiByIdQuery(selectedApiId ?? "", {
  skip: !selectedApiId,
});


 const apis: Api[] =
  allApisResponse && Array.isArray(allApisResponse.data)
    ? allApisResponse.data
    : [];
  const api = apiDetailResponse?.data?.api;
  console.log("API Detail Response", apiDetailResponse);
  console.log("API Detail", api);

  if (isApisLoading) return <Typography>Loading APIs...</Typography>;

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Admin API Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "flex-start",
        }}
      >
        {apis.map((api) => (
          <Box
            key={api._id}
            sx={{
              width: {
                xs: "100%",
                sm: "calc(50% - 8px)",
                md: "calc(33.333% - 11px)",
              },
              minWidth: "280px",
              flexGrow: 1,
            }}
          >
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6">{api.name}</Typography>
                <Typography color="textSecondary">
                  Method: {api.method}
                </Typography>
                <Typography color="textSecondary">
                  Price: {api.pricePerRequest} credits/request
                </Typography>
                <Typography color="textSecondary">
                  Calls: {api.callCount}
                </Typography>
                <Typography color="textSecondary">
                  Active: {api.isActive ? "Yes" : "No"}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedApiId(api._id)}
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog
        open={!!selectedApiId}
        onClose={() => setSelectedApiId(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>API Details</DialogTitle>
        <DialogContent>
          {isDetailLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              <Typography variant="subtitle1">Name: {api?.name}</Typography>
              <Typography>Description: {api?.description}</Typography>
              <Typography>Method: {api?.method}</Typography>
              <Typography>Endpoint: {api?.endpoint}</Typography>
              <Typography>
                Price per Request: {api?.pricePerRequest}
              </Typography>
              <Typography>Total Calls: {api?.callCount}</Typography>
              <Typography>
                Subscribers: {api?.subscribedUsers?.length}
              </Typography>
              <Typography>
                Created At:{" "}
                {api?.createdAt
                  ? new Date(api.createdAt).toLocaleString()
                  : ""}
              </Typography>
              <Typography>
                Updated At:{" "}
                {api?.updatedAt
                  ? new Date(api.updatedAt).toLocaleString()
                  : ""}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedApiId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
