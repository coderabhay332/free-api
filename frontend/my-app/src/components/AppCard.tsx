import React from 'react';
import { Card, Typography, Tag } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface AppCardProps {
  app: {
    _id: string;
    name: string;
    createdAt: string;
    subscribedApis?: string[];
    blockedApis?: string[];
  };
  onClick: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => (
  <Card
    hoverable
    onClick={onClick}
    style={{
      borderRadius: '8px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    bodyStyle={{ padding: '20px' }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AppstoreOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
        <Title 
          level={4} 
          style={{ 
            margin: 0, 
            color: '#262626',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          {app.name}
        </Title>
      </div>
      
      <Text style={{ color: '#8c8c8c', fontSize: '13px' }}>
        Created: {new Date(app.createdAt).toLocaleDateString()}
      </Text>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <Tag 
          color="blue" 
          style={{ 
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '4px'
          }}
        >
          {app.subscribedApis?.length || 0} Services
        </Tag>
        {(app.blockedApis?.length || 0) > 0 && (
          <Tag 
            color="red" 
            style={{ 
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            {app.blockedApis?.length || 0} Blocked
          </Tag>
        )}
      </div>
    </div>
  </Card>
);

export default AppCard; 