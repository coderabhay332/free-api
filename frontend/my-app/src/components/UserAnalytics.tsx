import React from 'react';
import { Card, Statistic, Typography, Spin } from 'antd';
import { ApiOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useGetUserAnalyticsQuery } from '../services/api';

const { Title } = Typography;

const UserAnalytics: React.FC = () => {
  const { data, isLoading, error } = useGetUserAnalyticsQuery();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '60px'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#ff4d4f'
      }}>
        Error loading analytics
      </div>
    );
  }

  const analytics = data?.data || {
    totalHits: 0,
    totalSpent: 0,
    subscribedServicesCount: 0,
    successCount: 0,
    failureCount: 0
  };

  const successRate = analytics.totalHits > 0 ? ((analytics.successCount / analytics.totalHits) * 100).toFixed(1) : 0;
  const failureRate = analytics.totalHits > 0 ? ((analytics.failureCount / analytics.totalHits) * 100).toFixed(1) : 0;

  interface StatCardProps {
    title: string;
    value: string | number;
    prefix: React.ReactNode;
    suffix?: React.ReactNode;
    color?: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, prefix, suffix, color = '#1890ff' }) => (
    <Card 
      style={{
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '16px',
        transition: 'all 0.2s ease'
      }}
      hoverable
      bodyStyle={{ padding: '24px' }}
    >
      <Statistic
        title={
          <div style={{ 
            color: '#8c8c8c', 
            fontSize: '14px',
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            {title}
          </div>
        }
        value={typeof value === 'number' && title.includes('Spent') 
          ? `$${value.toFixed(2)}` 
          : value
        }
        suffix={suffix}
        prefix={
          <span style={{ color, marginRight: '8px' }}>
            {prefix}
          </span>
        }
        valueStyle={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#262626'
        }}
      />
    </Card>
  );

  return (
    <div style={{
      padding: '32px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      <Title 
        level={2} 
        style={{
          marginBottom: '32px',
          color: '#262626',
          fontWeight: '600'
        }}
      >
        Analytics Overview
      </Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* API Hits and Spending */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <StatCard
              title="API Hits"
              value={analytics.totalHits.toLocaleString()}
              prefix={<ApiOutlined />}
              color="#1890ff"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Total Spent"
              value={analytics.totalSpent}
              prefix={<DollarOutlined />}
              color="#52c41a"
            />
          </div>
        </div>

        {/* Services */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ width: '48%' }}>
            <StatCard
              title="Active Services"
              value={analytics.subscribedServicesCount}
              prefix={<UserOutlined />}
              color="#722ed1"
            />
          </div>
        </div>

        {/* Success and Failure rates */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Success Rate"
              value={`${successRate}%`}
              suffix={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>({analytics.successCount})</span>}
              prefix={<CheckCircleOutlined />}
              color="#52c41a"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Failure Rate"
              value={`${failureRate}%`}
              suffix={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>({analytics.failureCount})</span>}
              prefix={<CloseCircleOutlined />}
              color="#ff4d4f"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;