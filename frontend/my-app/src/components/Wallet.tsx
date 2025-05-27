import React from 'react';
import { Card, Typography, Button, Statistic, Row, Col } from 'antd';
import { WalletOutlined, PlusOutlined, HistoryOutlined, GiftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface WalletProps {
  balance: number;
  freeCredits: number;
  onAddFunds: () => void;
}

const Wallet: React.FC<WalletProps> = ({ balance, freeCredits, onAddFunds }) => (
  <Card
    style={{
      borderRadius: '8px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: '24px'
    }}
    bodyStyle={{ padding: '24px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <Title 
          level={4} 
          style={{ 
            margin: 0, 
            color: '#262626',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}
        >
          <WalletOutlined style={{ color: '#1890ff' }} />
          Wallet Overview
        </Title>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Statistic
              title={
                <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                  Available Balance
                </Text>
              }
              value={balance}
              precision={2}
              prefix="$"
              valueStyle={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#262626'
              }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={
                <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                  Free Credits
                </Text>
              }
              value={freeCredits}
              prefix={<GiftOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#52c41a'
              }}
            />
          </Col>
        </Row>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginLeft: '24px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddFunds}
          style={{
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          Add Funds
        </Button>
        <Button
          icon={<HistoryOutlined />}
          style={{
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          Transaction History
        </Button>
      </div>
    </div>
  </Card>
);

export default Wallet; 