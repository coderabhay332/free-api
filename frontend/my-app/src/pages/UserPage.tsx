import React, { useState, Suspense } from 'react';
import { useGetAllApisQuery, useSubscribeToApiMutation, useMeQuery, useTestApiEndpointMutation, useGetApiByIdQuery } from '../services/api';
import { Card, Button, Typography, Space, Alert, Spin, Input, message, Row, Col, Tag, Modal, Descriptions, Skeleton } from 'antd';
import { WalletOutlined, ApiOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Api } from '../types';
import axios from 'axios';

const { Title, Text } = Typography;

// Lazy load heavy components
const ApiDetailsModal = React.lazy(() => import('../components/ApiDetailsModal'));
const ApiCard = React.lazy(() => import('../components/ApiCard'));

// Skeleton components
const ApiCardSkeleton = () => (
  <Card>
    <Skeleton active avatar paragraph={{ rows: 4 }} />
  </Card>
);

const ApiDetailsSkeleton = () => (
  <div style={{ padding: '20px' }}>
    <Skeleton active paragraph={{ rows: 8 }} />
  </div>
);

const UserPage: React.FC = () => {
  const { data: apisData, isLoading: isLoadingApis, error: apisError, refetch } = useGetAllApisQuery();
  const { data: userData, isLoading: isLoadingUser, refetch: refetchUserData } = useMeQuery();
  const [subscribeToApi] = useSubscribeToApiMutation();
  const [testApiEndpoint] = useTestApiEndpointMutation();
  const [selectedApi, setSelectedApi] = useState<string | null>(null);
  const [testEndpoint, setTestEndpoint] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Get detailed API information when an API is selected
  const { data: selectedApiData, isLoading: isLoadingSelectedApi } = useGetApiByIdQuery(selectedApi ?? '', {
    skip: !selectedApi,
  });

  const handleSubscribe = async (apiId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await subscribeToApi(apiId).unwrap();
      await Promise.all([
        refetchUserData(),
        apisData?.data && apisData.data.length > 0 && refetch()
      ]);
      setIsModalVisible(false);
      message.success('Successfully subscribed to API');
    } catch (error) {
      message.error('Failed to subscribe to API');
    }
  };

  const handleTestEndpoint = async (apiId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedApiData?.data) {
      message.error('API data not available');
      return;
    }

    // Check if user has enough credits
    if (!userData?.data) {
      message.error('User data not available');
      return;
    }

    if (userData.data.credit < selectedApiData.data.pricePerRequest) {
      message.error(`Insufficient credits. Required: ${selectedApiData.data.pricePerRequest}, Available: ${userData.data.credit}`);
      return;
    }

    setIsTesting(true);
    try {
      const result = await testApiEndpoint({ 
        apiId,
        endpoint: selectedApiData.data.endpoint
      }).unwrap();
      
      setTestResult(result.data);
      await Promise.all([
        refetchUserData(),
        refetch()
      ]);
      message.success('API test successful');
    } catch (error: any) {
      console.error('Test error:', error);
      const errorMessage = error.data?.message || 'Failed to test API endpoint';
      message.error(errorMessage);
      setTestResult({
        error: true,
        message: errorMessage,
        data: error.data?.data
      });
    } finally { 
      setIsTesting(false);
    }
  };

  const showApiDetails = (apiId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedApi(apiId);
    setIsModalVisible(true);
    // Set the test endpoint to the API's endpoint when opening the modal
    if (selectedApiData?.data) {
      setTestEndpoint(selectedApiData.data.endpoint);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedApi(null);
    setTestEndpoint('');
    setTestResult(null);
  };

  // Update test endpoint when selectedApiData changes
  React.useEffect(() => {
    if (selectedApiData?.data) {
      setTestEndpoint(selectedApiData.data.endpoint);
    }
  }, [selectedApiData]);

  if (isLoadingApis || isLoadingUser) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          <Title level={3}>Available APIs</Title>
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4].map((key) => (
              <Col xs={24} sm={12} md={8} lg={6} key={key}>
                <ApiCardSkeleton />
              </Col>
            ))}
          </Row>
        </Space>
      </div>
    );
  }

  const isSubscribed = (apiId: string) => userData?.data?.subscribedApis?.includes(apiId) ?? false;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space align="center">
            <WalletOutlined style={{ fontSize: '24px' }} />
            <Title level={4} style={{ margin: 0 }}>
              Wallet Balance: {userData?.data?.credit || 0} credits
            </Title>
          </Space>
        </Card>

        <Title level={3}>Available APIs</Title>
        
        <Row gutter={[16, 16]}>
          {apisData?.data?.map((api: Api) => (
            <Col xs={24} sm={12} md={8} lg={6} key={api._id}>
              <Suspense fallback={<ApiCardSkeleton />}>
                <ApiCard
                  api={api}
                  isSubscribed={isSubscribed(api._id)}
                  onSubscribe={(e) => handleSubscribe(api._id, e)}
                  onShowDetails={(e) => showApiDetails(api._id, e)}
                />
              </Suspense>
            </Col>
          ))}
        </Row>

        {(!apisData?.data || apisData.data.length === 0) && (
            <Card>
              <Text>No APIs available at the moment.</Text>
            </Card>
          )}

        <Suspense fallback={<ApiDetailsSkeleton />}>
          <ApiDetailsModal
            visible={isModalVisible}
            onClose={handleModalClose}
            apiId={selectedApi}
            apiData={selectedApiData?.data}
            isLoading={isLoadingSelectedApi}
            isSubscribed={selectedApi ? isSubscribed(selectedApi) : false}
            onSubscribe={(e) => selectedApi && handleSubscribe(selectedApi, e)}
            testEndpoint={testEndpoint}
            onTestEndpointChange={setTestEndpoint}
            onTest={(e) => selectedApi && handleTestEndpoint(selectedApi, e)}
            isTesting={isTesting}
            testResult={testResult}
            userCredit={userData?.data?.credit || 0}
          />
        </Suspense>
      </Space>
    </div>
  );
};

export default UserPage; 