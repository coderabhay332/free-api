import React from 'react';
import { Card, Statistic, Typography, Spin, Table, Tabs } from 'antd';
import { ApiOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useGetUserAnalyticsQuery } from '../services/api';

const { Title } = Typography;
const { TabPane } = Tabs;

const UserAnalytics: React.FC = () => {
  const { data, isLoading, error } = useGetUserAnalyticsQuery();

  if (isLoading) {
    return (
      <div style={{
        padding: '32px',
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: '#fafafa',
        minHeight: '100vh'
      }}>
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', padding: '60px' }} />
      </div>
    );
  }
  console.log("data", data);

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
    summary: {
      totalHits: 0,
      totalSpent: 0,
      subscribedServicesCount: 0,
      successCount: 0,
      failureCount: 0
    },
    serviceDetails: []
  };

  const successRate = analytics.summary.totalHits > 0 
    ? ((analytics.summary.successCount / analytics.summary.totalHits) * 100).toFixed(1) 
    : 0;
  const failureRate = analytics.summary.totalHits > 0 
    ? ((analytics.summary.failureCount / analytics.summary.totalHits) * 100).toFixed(1) 
    : 0;

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

  const serviceDetailsColumns = [
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: (text: string) => (
        <span style={{ fontWeight: '500', color: '#262626' }}>{text}</span>
      )
    },
    {
      title: 'Total Hits',
      dataIndex: 'hits',
      key: 'hits',
      render: (value: number) => (
        <span style={{ color: '#1890ff', fontWeight: '500' }}>
          {value.toLocaleString()}
        </span>
      ),
      sorter: (a: any, b: any) => a.hits - b.hits,
    },
    {
      title: 'Amount Spent',
      dataIndex: 'spent',
      key: 'spent',
      render: (value: number) => (
        <span style={{ color: '#52c41a', fontWeight: '600' }}>
          ${value.toFixed(2)}
        </span>
      ),
      sorter: (a: any, b: any) => a.spent - b.spent,
    },
    {
      title: 'Price/Call',
      dataIndex: 'pricePerCall',
      key: 'pricePerCall',
      render: (value: number) => (
        <span style={{ color: '#722ed1', fontWeight: '500' }}>
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Last Hit',
      dataIndex: 'lastHit',
      key: 'lastHit',
      render: (value: string | null) => (
        <span style={{ color: '#8c8c8c' }}>
          {value ? new Date(value).toLocaleString() : 'Never'}
        </span>
      ),
    }
  ];

  const recentHitsColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (value: string) => (
        <span style={{ color: '#8c8c8c' }}>
          {new Date(value).toLocaleString()}
        </span>
      )
    },
    {
      title: 'Response Time',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (value: number) => (
        <span style={{ color: '#1890ff', fontWeight: '500' }}>
          {value}ms
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <span style={{ 
          color: value === 'SUCCESS' ? '#52c41a' : '#ff4d4f',
          fontWeight: '500'
        }}>
          {value}
        </span>
      )
    }
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
        Analytics Overview
      </Title>

      <div style={{ marginBottom: '32px' }}>
        {/* API Hits and Spending */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <StatCard
              title="API Hits"
              value={analytics.summary.totalHits.toLocaleString()}
              prefix={<ApiOutlined />}
              color="#1890ff"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Total Spent"
              value={analytics.summary.totalSpent}
              prefix={<DollarOutlined />}
              color="#52c41a"
            />
          </div>
        </div>

        {/* Services and Success/Failure rates */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Active Services"
              value={analytics.summary.subscribedServicesCount}
              prefix={<UserOutlined />}
              color="#722ed1"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Success Rate"
              value={`${successRate}%`}
              suffix={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>({analytics.summary.successCount})</span>}
              prefix={<CheckCircleOutlined />}
              color="#52c41a"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Failure Rate"
              value={`${failureRate}%`}
              suffix={<span style={{ fontSize: '14px', color: '#8c8c8c' }}>({analytics.summary.failureCount})</span>}
              prefix={<CloseCircleOutlined />}
              color="#ff4d4f"
            />
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Service Usage" key="1">
          <Card 
            style={{
              borderRadius: '8px',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Table
              dataSource={analytics.serviceDetails}
              columns={serviceDetailsColumns}
              rowKey="serviceId"
              pagination={false}
              style={{
                backgroundColor: 'transparent'
              }}
              className="minimal-table"
            />
          </Card>
        </TabPane>
        <TabPane tab="Recent Activity" key="2">
          {analytics.serviceDetails.map((service: any) => (
            <Card
              key={service.serviceId}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ClockCircleOutlined />
                  <span>{service.serviceName}</span>
                </div>
              }
              style={{
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginBottom: '16px'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              {service.recentHits.length > 0 ? (
                <Table
                  dataSource={service.recentHits}
                  columns={recentHitsColumns}
                  rowKey="timestamp"
                  pagination={false}
                  style={{
                    backgroundColor: 'transparent'
                  }}
                  className="minimal-table"
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px' }}>
                  No recent activity
                </div>
              )}
            </Card>
          ))}
        </TabPane>
      </Tabs>

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

export default UserAnalytics;