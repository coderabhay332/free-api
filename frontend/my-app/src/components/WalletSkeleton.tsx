import React from 'react';
import { Card, Skeleton } from 'antd';

const WalletSkeleton: React.FC = () => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <Card
        style={{
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1, marginRight: '16px' }}>
            <Skeleton.Input active size="small" style={{ width: 100, marginBottom: '8px' }} />
            <Skeleton.Input active size="large" style={{ width: 150 }} />
          </div>
          <div style={{ flex: 1 }}>
            <Skeleton.Input active size="small" style={{ width: 100, marginBottom: '8px' }} />
            <Skeleton.Input active size="large" style={{ width: 150 }} />
          </div>
          <Skeleton.Button active size="large" style={{ width: 120 }} />
        </div>
      </Card>
    </div>
  );
};

export default WalletSkeleton; 