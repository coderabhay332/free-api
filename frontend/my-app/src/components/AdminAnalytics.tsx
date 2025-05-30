import React from 'react';
import { Card, Statistic, Typography, Table, Spin, Tabs } from 'antd';
import { UserOutlined, AppstoreOutlined, ApiOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined, TeamOutlined, LineChartOutlined } from '@ant-design/icons';
import { useGetAdminAnalyticsQuery } from '../services/api';

const { Title } = Typography;
const { TabPane } = Tabs;

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
    summary: {
      totalUsers: 0,
      totalApps: 0,
      totalServices: 0,
      totalHits: 0,
      totalRevenue: 0,
      totalUniqueUsers: 0,
      averageHitsPerService: 0,
      averageRevenuePerService: 0
    },
    topServices: [],
    serviceDetails: []
  };

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

  const topServicesColumns = [
    {
      title: 'Service Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: '500', color: '#262626' }}>{text}</span>
      )
    },
    {
      title: 'Total Hits',
      dataIndex: 'hits',
      key: 'hits',
      sorter: (a: any, b: any) => a.hits - b.hits,
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
    {
      title: 'Unique Users',
      dataIndex: 'uniqueUsers',
      key: 'uniqueUsers',
      render: (value: number) => (
        <span style={{ color: '#722ed1', fontWeight: '500' }}>
          {value}
        </span>
      ),
      sorter: (a: any, b: any) => a.uniqueUsers - b.uniqueUsers,
    }
  ];

  const serviceDetailsColumns = [
    {
      title: 'Service Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: '500', color: '#262626' }}>{text}</span>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price/Call',
      dataIndex: 'pricePerCall',
      key: 'pricePerCall',
      render: (value: number) => (
        <span style={{ color: '#52c41a', fontWeight: '600' }}>
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Total Hits',
      dataIndex: ['stats', 'totalHits'],
      key: 'totalHits',
      render: (value: number) => (
        <span style={{ color: '#1890ff', fontWeight: '500' }}>
          {value.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Revenue',
      dataIndex: ['stats', 'totalRevenue'],
      key: 'totalRevenue',
      render: (value: number) => (
        <span style={{ color: '#52c41a', fontWeight: '600' }}>
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Avg Response Time',
      dataIndex: ['stats', 'averageResponseTime'],
      key: 'averageResponseTime',
      render: (value: number) => (
        <span style={{ color: '#722ed1', fontWeight: '500' }}>
          {value.toFixed(0)}ms
        </span>
      ),
    }
  ];

  return (
    <div style={{
      padding: '32px',
      maxWidth: '1200px',
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
              value={analytics.summary.totalUsers.toLocaleString()}
              prefix={<UserOutlined />}
              color="#722ed1"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Total Apps"
              value={analytics.summary.totalApps.toLocaleString()}
              prefix={<AppstoreOutlined />}
              color="#13c2c2"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Total Services"
              value={analytics.summary.totalServices.toLocaleString()}
              prefix={<ApiOutlined />}
              color="#1890ff"
            />
          </div>
        </div>

        {/* Second row - Performance metrics */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Total API Hits"
              value={analytics.summary.totalHits.toLocaleString()}
              prefix={<ApiOutlined />}
              color="#1890ff"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Total Revenue"
              value={analytics.summary.totalRevenue}
              prefix={<DollarOutlined />}
              color="#52c41a"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Unique Users"
              value={analytics.summary.totalUniqueUsers.toLocaleString()}
              prefix={<TeamOutlined />}
              color="#722ed1"
            />
          </div>
        </div>

        {/* Third row - Averages */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Avg Hits/Service"
              value={analytics.summary.averageHitsPerService.toFixed(1)}
              prefix={<LineChartOutlined />}
              color="#1890ff"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="Avg Revenue/Service"
              value={`$${analytics.summary.averageRevenuePerService.toFixed(2)}`}
              prefix={<DollarOutlined />}
              color="#52c41a"
            />
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Top Services" key="1">
          <Card 
            style={{
              borderRadius: '8px',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Table
              dataSource={analytics.topServices}
              columns={topServicesColumns}
              rowKey="name"
              pagination={false}
              style={{
                backgroundColor: 'transparent'
              }}
              className="minimal-table"
            />
          </Card>
        </TabPane>
        <TabPane tab="Service Details" key="2">
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

export default AdminAnalytics;