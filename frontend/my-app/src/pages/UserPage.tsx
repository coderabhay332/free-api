import React, { useState } from 'react';
import { useGetAllApisQuery, useSubscribeToApiMutation, useMeQuery, useTestApiEndpointMutation } from '../services/api';
import { Card, Button, Typography, Space, Alert, Spin, Input, message } from 'antd';
import { WalletOutlined, ApiOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserPage: React.FC = () => {
  const { data: apisData, isLoading: isLoadingApis, error: apisError } = useGetAllApisQuery();
  const { data: userData, isLoading: isLoadingUser } = useMeQuery();
  const [subscribeToApi] = useSubscribeToApiMutation();
  const [testApiEndpoint] = useTestApiEndpointMutation();
  const [selectedApi, setSelectedApi] = useState<string | null>(null);
  const [testEndpoint, setTestEndpoint] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  console.log('APIs Data:', apisData);
  console.log('APIs Error:', apisError);

  const handleSubscribe = async (apiId: string) => {
    try {
      await subscribeToApi(apiId).unwrap();
      message.success('Successfully subscribed to API');
    } catch (error) {
      message.error('Failed to subscribe to API');
    }
  };

  const handleTestEndpoint = async (apiId: string) => {
    try {
      const result = await testApiEndpoint({ apiId, endpoint: testEndpoint }).unwrap();
      setTestResult(result.data);
      message.success('API test successful');
    } catch (error) {
      message.error('Failed to test API endpoint');
    }
  };

  if (isLoadingApis || isLoadingUser) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space align="center">
            <WalletOutlined style={{ fontSize: '24px' }} />
            <Title level={4} style={{ margin: 0 }}>
              Wallet Balance: ${userData?.data?.credits || 0}
            </Title>
          </Space>
        </Card>

        <Title level={3}>Available APIs</Title>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {apisData?.data?.apis?.length ? (
            apisData.data.apis.map((api) => (
              <Card
                key={api._id}
                title={api.name}
                extra={
                  <Button
                    type="primary"
                    onClick={() => handleSubscribe(api._id)}
                    disabled={userData?.data?.subscribedApis?.includes(api._id)}
                  >
                    {userData?.data?.subscribedApis?.includes(api._id) ? 'Subscribed' : 'Subscribe'}
                  </Button>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text>{api.description}</Text>
                  <Text type="secondary">Price per request: ${api.pricePerRequest}</Text>
                  <Text type="secondary">Method: {api.method}</Text>
                  <Text type="secondary">Endpoint: {api.endpoint}</Text>

                  {userData?.data?.subscribedApis?.includes(api._id) && (
                    <div style={{ marginTop: '16px' }}>
                      <Input
                        placeholder="Enter endpoint to test"
                        value={testEndpoint}
                        onChange={(e) => setTestEndpoint(e.target.value)}
                        style={{ marginBottom: '8px' }}
                      />
                      <Button
                        type="primary"
                        onClick={() => handleTestEndpoint(api._id)}
                        icon={<ApiOutlined />}
                      >
                        Test Endpoint
                      </Button>
                      {testResult && (
                        <Alert
                          style={{ marginTop: '8px' }}
                          message="Test Result"
                          description={JSON.stringify(testResult, null, 2)}
                          type="info"
                          showIcon
                        />
                      )}
                    </div>
                  )}
                </Space>
              </Card>
            ))
          ) : (
            <Card>
              <Text>No APIs available at the moment.</Text>
            </Card>
          )}
        </div>
      </Space>
    </div>
  );
};

export default UserPage; 