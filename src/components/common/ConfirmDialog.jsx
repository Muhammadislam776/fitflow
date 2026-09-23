import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-navy-900">{title}</h3>
        <p className="text-sm text-slate-500 mt-2">{message}</p>
        <div className="flex items-center justify-end gap-3 mt-6 w-full">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
