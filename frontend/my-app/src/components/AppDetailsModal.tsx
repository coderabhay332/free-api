import React from 'react';
import { Modal, Card, Typography, Space, Button, Input, Tag } from 'antd';
import { AppstoreOutlined, ApiOutlined, KeyOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import { message } from 'antd';

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
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AppstoreOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: '600', color: '#262626' }}>{app?.name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={null}
      style={{ top: 20 }}
    >
      <div style={{ padding: '8px 0' }}>
        {/* App Information */}
        <Card 
          style={{
            marginBottom: '24px',
            borderRadius: '8px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          bodyStyle={{ padding: '20px' }}
        >
          <Title level={4} style={{ marginBottom: '16px', color: '#262626', fontWeight: '600' }}>
            App Information
          </Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ minWidth: '80px', color: '#595959' }}>Name:</Text>
              <Text style={{ color: '#262626' }}>{app?.name}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ minWidth: '80px', color: '#595959' }}>API Key:</Text>
              <Input
                value={app?.apiKey?.key || 'No API key available'}
                readOnly
                style={{ maxWidth: '400px' }}
                prefix={<KeyOutlined style={{ color: '#8c8c8c' }} />}
                suffix={
                  app?.apiKey?.key && (
                    <Button
                      type="text"
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText(app.apiKey.key);
                        message.success('API key copied to clipboard');
                      }}
                    >
                      Copy
                    </Button>
                  )
                }
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ minWidth: '80px', color: '#595959' }}>Created:</Text>
              <Text style={{ color: '#262626' }}>{new Date(app?.createdAt).toLocaleDateString()}</Text>
            </div>
          </div>
        </Card>

        {/* Services List */}
        <Card 
          style={{
            borderRadius: '8px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          bodyStyle={{ padding: '20px' }}
        >
          <Title level={4} style={{ marginBottom: '16px', color: '#262626', fontWeight: '600' }}>
            Available Services
          </Title>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {services?.map((service) => {
              const isSubscribed = app?.subscribedApis?.includes(service._id);
              const isBlocked = app?.blockedApis?.includes(service._id);
              const endpoint = isSubscribed && app?.apiKey?.key ? `${service.endpoint}?key=${app.apiKey.key}` : null;

              return (
                <div
                  key={service._id}
                  style={{
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #f5f5f5',
                    marginBottom: '12px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Text strong style={{ color: '#262626', fontSize: '16px' }}>{service.name}</Text>
                        {isSubscribed && (
                          <Tag color={isBlocked ? 'red' : 'green'} style={{ fontSize: '11px' }}>
                            {isBlocked ? 'Blocked' : 'Active'}
                          </Tag>
                        )}
                      </div>
                      <Text style={{ color: '#595959', marginBottom: '12px', display: 'block' }}>
                        {service.description}
                      </Text>
                      
                      {endpoint && (
                        <div style={{ marginTop: '12px' }}>
                          <Text strong style={{ color: '#595959', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                            API Endpoint:
                          </Text>
                          <Input
                            value={endpoint}
                            readOnly
                            size="small"
                            style={{ fontSize: '12px' }}
                            suffix={
                              <Button
                                type="text"
                                size="small"
                                icon={<ApiOutlined />}
                                onClick={() => {
                                  navigator.clipboard.writeText(endpoint);
                                  message.success('Endpoint copied to clipboard');
                                }}
                              />
                            }
                          />
                        </div>
                      )}
                    </div>
                    
                    <div style={{ marginLeft: '16px' }}>
                      {!isSubscribed ? (
                        <Button 
                          type="primary" 
                          size="small"
                          onClick={() => onSubscribe(service._id)}
                          loading={loadingActions[service._id]}
                          style={{ minWidth: '80px' }}
                        >
                          Subscribe
                        </Button>
                      ) : isBlocked ? (
                        <Button 
                          icon={<PlayCircleOutlined />} 
                          size="small"
                          onClick={() => onUnblock(service._id)}
                          loading={loadingActions[service._id]}
                          style={{ minWidth: '80px' }}
                        >
                          Unblock
                        </Button>
                      ) : (
                        <Button 
                          danger 
                          icon={<StopOutlined />} 
                          size="small"
                          onClick={() => onBlock(service._id)}
                          loading={loadingActions[service._id]}
                          style={{ minWidth: '80px' }}
                        >
                          Block
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default AppDetailsModal; 