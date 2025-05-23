import React from 'react';
import { Card, Button, Space, Typography, Tag, Input, message } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Api } from '../types';

const { Text } = Typography;

interface ApiCardProps {
  api: Api;
  isSubscribed: boolean;
  onSubscribe: (e: React.MouseEvent) => void;
  onShowDetails: (e: React.MouseEvent) => void;
  subscription?: { apiKey: string };
}

const ApiCard: React.FC<ApiCardProps> = ({ api, isSubscribed, onSubscribe, onShowDetails, subscription }) => {
  const apiUrl = subscription ? `${api.endpoint}?apiKey=${subscription.apiKey}` : null;

  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      actions={[
        <Button
          type="primary"
          icon={<InfoCircleOutlined />}
          onClick={onShowDetails}
        >
          Details
        </Button>,
        <Button
          type={isSubscribed ? "default" : "primary"}
          onClick={onSubscribe}
          disabled={isSubscribed}
          icon={isSubscribed ? <CheckCircleOutlined /> : null}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      ]}
    >
      <Card.Meta
        title={
          <Space>
            {api.name}
            {isSubscribed && (
              <Tag color="success">Subscribed</Tag>
            )}
          </Space>
        }
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>{api.description}</Text>
            <Space>
              <Tag color="blue">{api.method}</Tag>
              <Tag color="purple">{api.pricePerRequest} credits/request</Tag>
            </Space>
            {apiUrl && (
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>API URL:</Text>
                <Input.TextArea
                  value={apiUrl}
                  autoSize
                  readOnly
                  style={{ marginTop: '4px' }}
                  onClick={(e) => {
                    e.currentTarget.select();
                    navigator.clipboard.writeText(apiUrl);
                    message.success('URL copied to clipboard!');
                  }}
                />
              </div>
            )}
          </Space>
        }
      />
    </Card>
  );
};

export default ApiCard; 