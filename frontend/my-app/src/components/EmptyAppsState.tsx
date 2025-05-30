import React from 'react';
import { Card, Typography, Button } from 'antd';
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface EmptyAppsStateProps {
  onCreateClick: () => void;
}

const EmptyAppsState: React.FC<EmptyAppsStateProps> = ({ onCreateClick }) => (
  <Card
    style={{
      borderRadius: '8px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      textAlign: 'center',
      padding: '40px'
    }}
    bodyStyle={{ padding: '40px' }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <AppstoreOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
      <div>
        <Title level={4} style={{ color: '#595959', marginBottom: '8px' }}>
          No apps created yet
        </Title>
        <Text style={{ color: '#8c8c8c' }}>
          Create your first app to get started with our API services
        </Text>
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateClick}
        style={{ marginTop: '8px' }}
      >
        Create Your First App
      </Button>
    </div>
  </Card>
);

export default EmptyAppsState; 