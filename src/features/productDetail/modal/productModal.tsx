import { Modal, Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

import styles from './productModal.module.scss';

interface ProductModalProps {
  isVisible: boolean;
  url?: string;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isVisible,
  url,
  onClose,
}) => {
  const [countdown, setCountdown] = useState<number>(10);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  useEffect(() => {
    if (isVisible) {
      const intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setIntervalId(intervalId);

      if (countdown <= 0) {
        window.open(url, '_self');
        clearInterval(intervalId);
      }

      return () => {
        clearInterval(intervalId);
        setIntervalId(undefined);
      };
    }
  }, [isVisible, countdown, url, onClose]);

  const handleClick = useCallback(() => {
    window.open(url, '_blank');
    setCountdown(10);
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
      <div className={styles.modalContainer}>
        <Button
          type="primary"
          onClick={handleClick}
          className={styles.modalButton}
          size="large"
        >
          <img
            src="/assets/logo-balancer.png"
            alt="Balancer"
            className={styles.modalIcon}
          />
          <div className={styles.modalContent}>
            <span className={styles.modalTitle}>Deposit on Balancer</span>
            <p className={styles.modalDescription}>
              Access all QuantAMM Pools directly on Balancer&apos;s UI
            </p>
          </div>
          <ExternalLink className={styles.externalLinkIcon} />
        </Button>
      </div>

      <div className={styles.redirectContainer}>
        <div className={styles.redirectMessage}>
          <p>Redirecting to Balancer in</p>
          <span className={styles.countdownNumber}>{countdown}</span>
          <p>seconds...</p>
        </div>
      </div>
    </Modal>
  );
};
