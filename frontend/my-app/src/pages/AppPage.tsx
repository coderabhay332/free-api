import React, { useState, useEffect } from 'react';
import { useGetAllAppsQuery, useGetAllServicesQuery, useSubscribeServiceMutation, useBlockServiceMutation, useUnblockServiceMutation, useGetAppByIdQuery } from '../services/api';
import { Card, Button, Typography, Space, Alert, Spin, Input, message, Row, Col, Tag, Modal, Descriptions, List } from 'antd';
import { PlusOutlined, ApiOutlined, CheckCircleOutlined, StopOutlined, PlayCircleOutlined } from '@ant-design/icons';
import CreateAppModal from '../components/CreateAppModal';


const { Title, Text } = Typography;

interface AppDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  app: any;
  services: any[];
  onSubscribe: (serviceId: string) => void;
  onBlock: (serviceId: string) => void;
  onUnblock: (serviceId: string) => void;
  loadingActions: { [key: string]: boolean };
}

const AppDetailsModal: React.FC<AppDetailsModalProps> = ({
  visible,
  onClose,
  app,
  services,
  onSubscribe,
  onBlock,
  onUnblock,
  loadingActions,
}) => {
  return (
    <Modal
      title={`App Details: ${app?.name}`}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions title="App Information" bordered>
          <Descriptions.Item label="Name">{app?.name}</Descriptions.Item>
          <Descriptions.Item label="API Key">
            {app?.apiKey?.key || 'No API key available'}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">{new Date(app?.createdAt).toLocaleDateString()}</Descriptions.Item>
        </Descriptions>

        <Title level={4}>Available Services</Title>
        <List
          dataSource={services}
          renderItem={(service) => {
            const isSubscribed = app?.subscribedApis?.includes(service._id);
            const isBlocked = app?.blockedApis?.includes(service._id);
            const endpoint = isSubscribed && app?.apiKey?.key ? `${service.endpoint}?key=${app.apiKey.key}` : null;

            return (
              <List.Item
                actions={[
                  !isSubscribed ? (
                    <Button 
                      type="primary" 
                      onClick={() => onSubscribe(service._id)}
                      loading={loadingActions[service._id]}
                    >
                      Subscribe
                    </Button>
                  ) : isBlocked ? (
                    <Button 
                      icon={<PlayCircleOutlined />} 
                      onClick={() => onUnblock(service._id)}
                      loading={loadingActions[service._id]}
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button 
                      danger 
                      icon={<StopOutlined />} 
                      onClick={() => onBlock(service._id)}
                      loading={loadingActions[service._id]}
                    >
                      Block
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  title={service.name}
                  description={
                    <Space direction="vertical">
                      <Text>{service.description}</Text>
                      {endpoint && (
                        <Space>
                          <Text strong>Endpoint:</Text>
                          <Input
                            value={endpoint}
                            readOnly
                            style={{ width: '400px' }}
                            suffix={
                              <Button
                                type="text"
                                icon={<ApiOutlined />}
                                onClick={() => {
                                  navigator.clipboard.writeText(endpoint);
                                  message.success('Endpoint copied to clipboard');
                                }}
                              />
                            }
                          />
                        </Space>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Space>
    </Modal>
  );
};

const AppPage: React.FC = () => {
  const { data: appsData, isLoading: isLoadingApps, refetch: refetchApps } = useGetAllAppsQuery();
  const { data: servicesData, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const { data: appDetails } = useGetAppByIdQuery(selectedApp?._id || '', { skip: !selectedApp?._id });
  const [subscribeService] = useSubscribeServiceMutation();
  const [blockService] = useBlockServiceMutation();
  const [unblockService] = useUnblockServiceMutation();
  

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});

  const handleAppSelect = (app: any) => {
    setSelectedApp(app);
    setIsModalVisible(true);
  };

  const handleSubscribe = async (serviceId: string) => {
    if (!selectedApp) return;
    try {
      setLoadingActions(prev => ({ ...prev, [serviceId]: true }));
      const result = await subscribeService({ serviceId, appId: selectedApp._id }).unwrap();
      message.success('Service subscribed successfully');
      setSelectedApp(result.data);
      await refetchApps();
    } catch (error: any) {
      message.error(error.data?.message || 'Failed to subscribe to service');
    } finally {
      setLoadingActions(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleBlock = async (serviceId: string) => {
    if (!selectedApp) return;
    try {
      setLoadingActions(prev => ({ ...prev, [serviceId]: true }));
      const result = await blockService({ serviceId, appId: selectedApp._id }).unwrap();
      message.success('Service blocked successfully');
      setSelectedApp(result.data);
      await refetchApps();
    } catch (error: any) {
      message.error(error.data?.message || 'Failed to block service');
    } finally {
      setLoadingActions(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleUnblock = async (serviceId: string) => {
    if (!selectedApp) return;
    try {
      setLoadingActions(prev => ({ ...prev, [serviceId]: true }));
      const result = await unblockService({ serviceId, appId: selectedApp._id }).unwrap();
      message.success('Service unblocked successfully');
      setSelectedApp(result.data);
      await refetchApps();
    } catch (error: any) {
      message.error(error.data?.message || 'Failed to unblock service');
    } finally {
      setLoadingActions(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  if (isLoadingApps || isLoadingServices) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Title level={2}>My Apps</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
          >
            Create New App
          </Button>
        </Space>

        <Row gutter={[16, 16]}>
          {appsData?.data?.map((app) => (
            <Col xs={24} sm={12} md={8} lg={6} key={app._id}>
              <Card
                hoverable
                onClick={() => handleAppSelect(app)}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={4}>{app.name}</Title>
                  <Text type="secondary">Created: {new Date(app.createdAt).toLocaleDateString()}</Text>
                  <Space>
                    <Tag color="blue">{app.subscribedApis?.length || 0} Services</Tag>
                    <Tag color="red">{app.blockedApis?.length || 0} Blocked</Tag>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {(!appsData?.data || appsData.data.length === 0) && (
          <Card>
            <Text>No apps created yet. Create your first app to get started!</Text>
          </Card>
        )}

        <CreateAppModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onSuccess={refetchApps}
        />

        <AppDetailsModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedApp(null);
          }}
          app={selectedApp}
          services={servicesData?.data || []}
          onSubscribe={handleSubscribe}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
          loadingActions={loadingActions}
        />
      </Space>
    </div>
  );
};

export default AppPage; 