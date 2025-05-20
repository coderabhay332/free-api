import React from 'react';
import { Card, Button, Space, Typography, Tag } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Api } from '../types';

const { Text } = Typography;

interface ApiCardProps {
  api: Api;
  isSubscribed: boolean;
  onSubscribe: (e: React.MouseEvent) => void;
  onShowDetails: (e: React.MouseEvent) => void;
}

const ApiCard: React.FC<ApiCardProps> = ({ api, isSubscribed, onSubscribe, onShowDetails }) => {
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
            <Text type="secondary">Endpoint: {api.endpoint}</Text>
          </Space>
        }
      />
    </Card>
  );
};

export default ApiCard; 