import React, { useState, Suspense, lazy } from 'react';
import { useGetAllAppsQuery, useGetAllServicesQuery, useSubscribeServiceMutation, useBlockServiceMutation, useUnblockServiceMutation, useMeQuery, useAddFundsMutation } from '../services/api';
import { Typography, Button, Spin, message, Modal, Input, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import WalletSkeleton from '../components/WalletSkeleton';
import AppCardSkeleton from '../components/AppCardSkeleton';

const { Title } = Typography;

// Lazy load components
const CreateAppModal = lazy(() => import('../components/CreateAppModal'));
const AppCard = lazy(() => import('../components/AppCard'));
const EmptyAppsState = lazy(() => import('../components/EmptyAppsState'));
const AppDetailsModal = lazy(() => import('../components/AppDetailsModal'));
const Wallet = lazy(() => import('../components/Wallet'));

const AppPage: React.FC = () => {
  const { data: appsData, isLoading: isLoadingApps, refetch: refetchApps } = useGetAllAppsQuery();
  const { data: servicesData, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const { data: userData, isLoading: isLoadingUser, refetch: refetchUser } = useMeQuery();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [subscribeService] = useSubscribeServiceMutation();
  const [blockService] = useBlockServiceMutation();
  const [unblockService] = useUnblockServiceMutation();
  const [addFunds] = useAddFundsMutation();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  const [isAddFundsModalVisible, setIsAddFundsModalVisible] = useState(false);
  const [amount, setAmount] = useState<string>('');

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

  const handleAddFunds = () => {
    setIsAddFundsModalVisible(true);
  };

  const handleAddFundsSubmit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      message.error('Please enter a valid amount');
      return;
    }
    try {
      await addFunds({ amount: numAmount }).unwrap();
      await refetchUser();
      message.success(`Successfully added $${numAmount.toFixed(2)} to your wallet`);
      setIsAddFundsModalVisible(false);
      setAmount('');
    } catch (error: any) {
      message.error(error.data?.message || 'Failed to add funds');
    }
  };

  const renderSkeletons = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <AppCardSkeleton key={index} />
    ));
  };

  if (isLoadingApps || isLoadingServices || isLoadingUser) {
    return (
      <div style={{ 
        padding: '32px',
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: '#fafafa',
        minHeight: '100vh'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <Skeleton.Input active size="large" style={{ width: 200 }} />
          <Skeleton.Button active size="large" style={{ width: 150 }} />
        </div>
        <WalletSkeleton />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {renderSkeletons(3)}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '32px',
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <Title 
          level={2} 
          style={{
            margin: 0,
            color: '#262626',
            fontWeight: '600'
          }}
        >
          My Applications
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
          style={{
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          Create New App
        </Button>
      </div>

      {/* Wallet */}
      <Suspense fallback={<WalletSkeleton />}>
        <Wallet 
          balance={userData?.data?.wallet?.balance || 0}
          freeCredits={userData?.data?.wallet?.freeCredits || 0}
          onAddFunds={handleAddFunds}
        />
      </Suspense>

      {/* Apps Grid */}
      {appsData?.data && appsData.data.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          <Suspense fallback={renderSkeletons(3)}>
            {appsData.data.map((app: any) => (
              <AppCard
                key={app._id}
                app={app}
                onClick={() => handleAppSelect(app)}
              />
            ))}
          </Suspense>
        </div>
      ) : (
        <Suspense fallback={<div style={{ height: '200px' }}><Spin size="large" /></div>}>
          <EmptyAppsState onCreateClick={() => setIsCreateModalVisible(true)} />
        </Suspense>
      )}

      {/* Modals */}
      <Suspense fallback={null}>
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
      </Suspense>

      {/* Add Funds Modal */}
      <Modal
        title="Add Funds to Wallet"
        open={isAddFundsModalVisible}
        onOk={handleAddFundsSubmit}
        onCancel={() => {
          setIsAddFundsModalVisible(false);
          setAmount('');
        }}
        okText="Add Funds"
        cancelText="Cancel"
      >
        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          prefix="$"
          style={{ marginTop: '16px' }}
        />
      </Modal>
    </div>
  );
};

export default AppPage;