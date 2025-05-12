import { Modal, Button, Radio } from 'antd';
import React, { useCallback, useState } from 'react';
import { ExternalLink } from 'lucide-react';

import styles from './termsOfService.module.scss';
import TermsOfService from './landing/termsOfService';

interface TermsOfServiceModalProps {
  isVisible: boolean;
  url?: string;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isVisible,
  url,
  onClose,
}) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const [acceptTermsOfService, setAcceptTermsOfService] = useState(false);

  const handleClick = useCallback(() => {
    window.open(url, '_blank');
    clearInterval(intervalId);
    setIntervalId(undefined);
    onClose();
  }, [intervalId, url, onClose]);

  return (
    <Modal
      title={<div className={styles.modalTitle}>Add liquidity</div>}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      className={styles.depositModal}
      width={600}
    >
      <div style={{ width: '100%', height:'500px', overflowY: 'auto' }}>
        <TermsOfService/>
      </div>
      <ExternalLink href='https://quantamm.fi/tos'>Terms of Service Page</ExternalLink>
      <div className={styles.radioContainer}>
        <Radio
          onClick={() => setAcceptTermsOfService(!acceptTermsOfService)}
          checked={acceptTermsOfService}
        >
          By clicking accept, I agree that I have read and understood the Terms
          of Service including, but not limited to, agreeing I am not in any
          prohibited user groups/regions.
        </Radio>
      </div>
      <div className={styles.modalContainer}>
        <Button
          type="primary"
          onClick={handleClick}
          className={styles.modalButton}
          size="large"
          disabled={!acceptTermsOfService}
          style={{ marginTop: '20px' }}
        >
          <img
            src="/assets/quantamm-logo.png"
            alt="QuantAMM"
            className={styles.modalIcon}
          />
          <div className={styles.modalContent}>
            <p className={styles.modalDescription}>
              {acceptTermsOfService
                ? 'Continue'
                : 'Use of this site or products requires acceptance and adherence to the terms of service'}
            </p>
          </div>
        </Button>
      </div>
    </Modal>
  );
};
