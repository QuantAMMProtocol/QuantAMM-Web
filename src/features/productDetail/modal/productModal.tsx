import { Modal, Button, Radio } from 'antd';
import React, { useCallback, useState } from 'react';
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
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const [understandExternalWebsite, setUnderstandExternalWebsite] =
    useState(false);

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
      <div style={{ width: '100%' }}>
        <h5>Redirection to external website</h5>
        <p>
          The website or web pages to which you are redirected are not owned by
          QuantAMM. QuantAMM therefore shall not be held liable for any
          information, data, details, explanations and representations
          (hereinafter referred to as &quot;Information&quot;) provided on such websites,
          in particular not for damages that may result from the use of this
          Information for your own investment decisions. Price and performance
          data on the websites of Bitwise may differ from the price information
          on the websites of the respective online brokers or banks.
        </p>

        <p>
          The information on the websites to which you are redirected is the
          sole responsibility of their providers. The offers you find on the
          providers&apos; websites are expressly not directed at persons in countries
          that prohibit the provision or retrieval of the content posted
          therein. Each user is responsible for finding out about any
          restrictions before accessing the websites and complying with them.
        </p>
      </div>
      <div className={styles.radioContainer}>
        <Radio
          onClick={() =>
            setUnderstandExternalWebsite(!understandExternalWebsite)}
          checked={understandExternalWebsite}
        >
          By clicking continue, I agree that I have read and understood the
          disclaimer about the forwarding to external websites.
        </Radio>
      </div>
      <div className={styles.modalContainer}>
        <Button
          type="primary"
          onClick={handleClick}
          className={styles.modalButton}
          size="large"
          disabled={!understandExternalWebsite}
          style={{marginTop: '20px'}}
        >
          <img
            src="/assets/logo-balancer.png"
            alt="Balancer"
            className={styles.modalIcon}
          />
          <div className={styles.modalContent}>
            <span className={styles.modalTitle}>Deposit on Balancer</span>
            <p className={styles.modalDescription}>
              Continue to Balancer&apos;s website to deposit your assets.
            </p>
          </div>
          <ExternalLink className={styles.externalLinkIcon} />
        </Button>
      </div>
    </Modal>
  );
};
