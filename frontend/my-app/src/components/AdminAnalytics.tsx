import React from 'react';
import { Card, Statistic, Typography, Table, Spin } from 'antd';
import { UserOutlined, AppstoreOutlined, ApiOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useGetAdminAnalyticsQuery } from '../services/api';

const { Title } = Typography;

const AdminAnalytics: React.FC = () => {
  const { data, isLoading } = useGetAdminAnalyticsQuery();

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

  const analytics = data?.data || {
    totalUsers: 0,
    totalApps: 0,
    totalServices: 0,
    totalHits: 0,
    totalRevenue: 0,
    successCount: 0,
    failureCount: 0,
    topServices: []
  };

  const successRate = analytics.totalHits > 0 ? ((analytics.successCount / analytics.totalHits) * 100).toFixed(1) : 0;
  const failureRate = analytics.totalHits > 0 ? ((analytics.failureCount / analytics.totalHits) * 100).toFixed(1) : 0;

  type StatCardProps = {
    title: string;
    value: string | number;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    color?: string;
  };

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
        value={typeof value === 'number' && title.includes('Revenue') 
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

  const columns = [
    {
      title: 'Service Name',
      dataIndex: ['service', 'name'],
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: '500', color: '#262626' }}>{text}</span>
      )
    },
    {
      title: 'Total Hits',
      dataIndex: 'hitCount',
      key: 'hitCount',
      sorter: (a: any, b: any) => a.hitCount - b.hitCount,
      render: (value: number) => (
        <span style={{ color: '#1890ff', fontWeight: '500' }}>
          {value.toLocaleString()}
        </span>
      )
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => (
        <span style={{ color: '#52c41a', fontWeight: '600' }}>
          ${value.toFixed(2)}
        </span>
      ),
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
  ];

  return (
    <div style={{
      padding: '32px',
      maxWidth: '1000px',
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
        Admin Dashboard
      </Title>

      
      <div style={{ marginBottom: '32px' }}>
        {/* First row - Core metrics */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Total Users"
              value={analytics.totalUsers.toLocaleString()}
              prefix={<UserOutlined />}
              color="#722ed1"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Total Apps"
              value={analytics.totalApps.toLocaleString()}
              prefix={<AppstoreOutlined />}
              color="#13c2c2"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Total Services"
              value={analytics.totalServices.toLocaleString()}
              prefix={<ApiOutlined />}
              color="#1890ff"
            />
          </div>
        </div>

        {/* Second row - Performance metrics */}
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
              title="Total Revenue"
              value={analytics.totalRevenue}
              prefix={<DollarOutlined />}
              color="#52c41a"
            />
          </div>
        </div>

        {/* Third row - Success/Failure rates */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Success Rate"
              value={`${successRate}%`}
              suffix={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>({analytics.successCount.toLocaleString()})</span>}
              prefix={<CheckCircleOutlined />}
              color="#52c41a"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Failure Rate"
              value={`${failureRate}%`}
              suffix={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>({analytics.failureCount.toLocaleString()})</span>}
              prefix={<CloseCircleOutlined />}
              color="#ff4d4f"
            />
          </div>
        </div>
      </div>

      {/* Top Services Table */}
      <Card 
        style={{
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Title 
          level={3} 
          style={{
            marginBottom: '20px',
            color: '#262626',
            fontWeight: '600',
            fontSize: '18px'
          }}
        >
          Top Performing Services
        </Title>
        <Table
          dataSource={analytics.topServices}
          columns={columns}
          rowKey="_id"
          pagination={false}
          style={{
            backgroundColor: 'transparent'
          }}
          className="minimal-table"
        />
      </Card>

      <style>{`
        .minimal-table .ant-table-thead > tr > th {
          background-color: #fafafa;
          border-bottom: 2px solid #f0f0f0;
          font-weight: 600;
          color: #595959;
          padding: 16px;
        }
        .minimal-table .ant-table-tbody > tr > td {
          padding: 16px;
          border-bottom: 1px solid #f5f5f5;
        }
        .minimal-table .ant-table-tbody > tr:hover > td {
          background-color: #fafafa;
        }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;