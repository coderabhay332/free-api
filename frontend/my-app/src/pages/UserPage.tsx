import React, { useState, Suspense } from 'react';
import { useGetAllApisQuery, useSubscribeToApiMutation, useMeQuery, useTestApiEndpointMutation, useGetApiByIdQuery, useGetDemoUsersMutation, useGetDemoProductsMutation, useGetDemoWeatherMutation, useGetDemoNewsMutation } from '../services/api';
import { Card, Button, Typography, Space, Alert, Spin, Input, message, Row, Col, Tag, Modal, Descriptions, Skeleton } from 'antd';
import { WalletOutlined, ApiOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Api } from '../types';
import axios from 'axios';

const { Title, Text } = Typography;


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

// Wallet Balance Component
const WalletBalance: React.FC<{ credit: number }> = ({ credit }) => (
  <Card>
    <Space align="center">
      <WalletOutlined style={{ fontSize: '24px' }} />
      <Title level={4} style={{ margin: 0 }}>
        Wallet Balance: {credit} credits
      </Title>
    </Space>
  </Card>
);

// Main Component
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

  const [getDemoUsers] = useGetDemoUsersMutation();
  const [getDemoProducts] = useGetDemoProductsMutation();
  const [getDemoWeather] = useGetDemoWeatherMutation();
  const [getDemoNews] = useGetDemoNewsMutation();

  // Add credit check function
  const checkCredit = (requiredCredit: number) => {
    if (!userData?.data) {
      message.error('User data not available');
      return false;
    }

    if (userData.data.credit < requiredCredit) {
      message.error({
        content: `Insufficient credits! You need ${requiredCredit} credits. Your current balance: ${userData.data.credit} credits.`,
        duration: 5,
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    }
    return true;
  };

  const handleSubscribe = async (apiId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const api = apisData?.data?.find(a => a._id === apiId);
    if (!api) {
      message.error('API not found');
      return;
    }

    if (!checkCredit(api.pricePerRequest)) {
      return;
    }

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

    if (!userData?.data?.apiKey) {
      message.error('No API key found. Please subscribe to an API first.');
      return;
    }

    const apiUrl = `${selectedApiData.data.endpoint}?apiKey=${userData.data.apiKey}`;
    setTestEndpoint(apiUrl);
    message.info('API URL: ' + apiUrl);

    setIsTesting(true);
    try {
      const result = await testApiEndpoint({ 
        apiId,
        endpoint: apiUrl,
        method: selectedApiData.data.method
      }).unwrap();
      
      if(result.data.message === "Insufficient credit"){
        setTestResult("insufficient credits");
        return;
      }
      
      setTestResult(result.data);
      await Promise.all([
        refetchUserData(),
        refetch()
      ]);
      message.success('API test successful');
    } catch (error: any) {
      console.error('Test error details:', error);
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
    if (selectedApiData?.data && userData?.data?.apiKey) {
      const apiUrl = `${selectedApiData.data.endpoint}?apiKey=${userData.data.apiKey}`;
      setTestEndpoint(apiUrl);
      message.info('API URL: ' + apiUrl);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedApi(null);
    setTestEndpoint('');
    setTestResult(null);
  };

 
  React.useEffect(() => {
    if (selectedApiData?.data && userData?.data?.apiKey) {
      setTestEndpoint(`${selectedApiData.data.endpoint}?apiKey=${userData.data.apiKey}`);
    }
  }, [selectedApiData, userData?.data?.apiKey]);

  if (isLoadingApis || isLoadingUser) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <ApiCardSkeleton />
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

  const isSubscribed = (apiId: string) => userData?.data?.subscribedApis?.some(sub => sub.api === apiId) ?? false;
  const getSubscription = (apiId: string) => {
    const sub = userData?.data?.subscribedApis?.find(sub => sub.api === apiId);
    return sub && userData?.data?.apiKey ? { api: apiId, apiKey: userData.data.apiKey } : undefined;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <WalletBalance credit={userData?.data?.credit || 0} />

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
                  subscription={getSubscription(api._id)}
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
            subscription={selectedApi ? getSubscription(selectedApi) : undefined}
          />
        </Suspense>
      </Space>
    </div>
  );
};

export default UserPage; 