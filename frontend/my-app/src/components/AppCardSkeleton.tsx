import React from 'react';
import { Card, Skeleton } from 'antd';

const AppCardSkeleton: React.FC = () => {
  return (
    <Card
      style={{
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease'
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <Skeleton.Input active size="large" style={{ width: '80%', marginBottom: '16px' }} />
      <Skeleton.Input active size="small" style={{ width: '60%', marginBottom: '16px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton.Input active size="small" style={{ width: 100 }} />
        <Skeleton.Button active size="small" style={{ width: 80 }} />
      </div>
    </Card>
  );
};

export default AppCardSkeleton; 