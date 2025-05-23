import React from 'react';
import { Modal, Button, Descriptions, Tag, Space, Input, Typography, Alert, Spin, message, Card } from 'antd';
import { ApiOutlined, CopyOutlined } from '@ant-design/icons';
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
  subscription?: { api: string; apiKey: string };
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
  userCredit,
  subscription
}) => {
  const apiUrl = subscription && apiData ? `${apiData.endpoint}?apiKey=${subscription.apiKey}` : null;

  const handleCopyUrl = () => {
    if (apiUrl) {
      navigator.clipboard.writeText(apiUrl);
      message.success('API URL copied to clipboard!');
    }
  };

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
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{apiData?.name}</Descriptions.Item>
            <Descriptions.Item label="Description">{apiData?.description}</Descriptions.Item>
            <Descriptions.Item label="Method">
              <Tag color="blue">{apiData?.method}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Price per Request">
              <Tag color="purple">{apiData?.pricePerRequest} credits</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Your Credit">
              <Tag color={userCredit >= (apiData?.pricePerRequest || 0) ? "success" : "error"}>
                {userCredit} credits
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          {apiUrl && (
            <Card title="API URL" extra={
              <Button 
                type="primary" 
                icon={<CopyOutlined />} 
                onClick={handleCopyUrl}
              >
                Copy URL
              </Button>
            }>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input.TextArea
                  value={apiUrl}
                  autoSize
                  readOnly
                  onClick={(e) => {
                    e.currentTarget.select();
                    handleCopyUrl();
                  }}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Share this URL with anyone to access the API. Credits will be deducted from your account when the API is used.
                </Text>
              </Space>
            </Card>
          )}

          {isSubscribed && (
            <Card title="Test API">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  value={testEndpoint}
                  onChange={(e) => onTestEndpointChange(e.target.value)}
                  placeholder="Enter endpoint to test"
                />
                <Button
                  type="primary"
                  onClick={onTest}
                  loading={isTesting}
                  icon={<ApiOutlined />}
                >
                  Test Endpoint
                </Button>
                {testResult && (
                  <Alert
                    message={testResult.error ? "Error" : "Success"}
                    description={
                      <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
                        {JSON.stringify(testResult, null, 2)}
                      </pre>
                    }
                    type={testResult.error ? "error" : "success"}
                    showIcon
                  />
                )}
              </Space>
            </Card>
          )}
        </Space>
      )}
    </Modal>
  );
};

export default ApiDetailsModal; 