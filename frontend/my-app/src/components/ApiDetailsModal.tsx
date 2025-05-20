import React from 'react';
import { Modal, Button, Descriptions, Tag, Space, Input, Typography, Alert, Spin } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import { Api } from '../types';

const { Title, Text } = Typography;

interface ApiDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  apiId: string | null;
  apiData?: Api;
  isLoading: boolean;
  isSubscribed: boolean;
  onSubscribe: (e: React.MouseEvent) => void;
  testEndpoint: string;
  onTestEndpointChange: (value: string) => void;
  onTest: (e: React.MouseEvent) => void;
  isTesting: boolean;
  testResult: any;
  userCredit: number;
}

const ApiDetailsModal: React.FC<ApiDetailsModalProps> = ({
  visible,
  onClose,
  apiId,
  apiData,
  isLoading,
  isSubscribed,
  onSubscribe,
  testEndpoint,
  onTestEndpointChange,
  onTest,
  isTesting,
  testResult,
  userCredit
}) => {
  return (
    <Modal
      title="API Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="subscribe"
          type="primary"
          onClick={onSubscribe}
          disabled={isSubscribed}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      ]}
      width={800}
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : apiData ? (
        <div>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{apiData.name}</Descriptions.Item>
            <Descriptions.Item label="Description">{apiData.description}</Descriptions.Item>
            <Descriptions.Item label="Method">{apiData.method}</Descriptions.Item>
            <Descriptions.Item label="Endpoint">{apiData.endpoint}</Descriptions.Item>
            <Descriptions.Item label="Price per Request">{apiData.pricePerRequest} credits</Descriptions.Item>
            <Descriptions.Item label="Total Calls">{apiData.callCount}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={apiData.isActive ? "success" : "error"}>
                {apiData.isActive ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          {isSubscribed && (
            <div style={{ marginTop: '20px' }}>
              <Title level={5}>Test API</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  placeholder="Enter endpoint to test"
                  value={testEndpoint}
                  onChange={(e) => onTestEndpointChange(e.target.value)}
                  disabled={isTesting}
                />
                <Text type="secondary" style={{ marginBottom: '8px' }}>
                  Required credits: {apiData.pricePerRequest} (Your balance: {userCredit})
                </Text>
                <Button
                  type="primary"
                  onClick={onTest}
                  icon={<ApiOutlined />}
                  loading={isTesting}
                  block
                >
                  {isTesting ? 'Testing...' : 'Test Endpoint'}
                </Button>
                {testResult && (
                  <Alert
                    style={{ marginTop: '8px' }}
                    message={testResult.error ? "Error" : "Test Result"}
                    description={
                      testResult.error 
                        ? `${testResult.message}${testResult.data ? `\n${JSON.stringify(testResult.data, null, 2)}` : ''}`
                        : JSON.stringify(testResult, null, 2)
                    }
                    type={testResult.error ? "error" : "info"}
                    showIcon
                  />
                )}
              </Space>
            </div>
          )}
        </div>
      ) : (
        <Text>No API details available</Text>
      )}
    </Modal>
  );
};

export default ApiDetailsModal; 