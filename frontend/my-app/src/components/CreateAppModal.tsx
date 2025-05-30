import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { useCreateAppMutation } from '../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface CreateAppModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAppModal: React.FC<CreateAppModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [newAppName, setNewAppName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createApp] = useCreateAppMutation();
  const { auth } = useSelector((state: RootState) => state);
  console.log(auth)
  console.log(auth?.user?._id)
  const handleCreateApp = async () => {
    if (!newAppName.trim()) {
      message.error('Please enter an app name');
      return;
    }
   

    setIsCreating(true);
    try {
      await createApp({
        name: newAppName,
        user: auth?.user?._id || '',
    
      }).unwrap();
      message.success('App created successfully');
      onClose();
      setNewAppName('');
      onSuccess();
    } catch (error: any) {
      message.error(error.data?.message || 'Failed to create app');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal
      title="Create New App"
      open={visible}
      onCancel={() => {
        onClose();
        setNewAppName('');
      }}
      onOk={handleCreateApp}
      confirmLoading={isCreating}
    >
      <Input
        placeholder="Enter app name"
        value={newAppName}
        onChange={(e) => setNewAppName(e.target.value)}
        onPressEnter={handleCreateApp}
      />
    </Modal>
  );
};

export default CreateAppModal; 