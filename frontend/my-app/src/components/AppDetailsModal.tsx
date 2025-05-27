import React from 'react';
import { Modal, Space, Typography, Descriptions, List, Button, Input, message } from 'antd';
import { ApiOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';

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

export default AppDetailsModal; 