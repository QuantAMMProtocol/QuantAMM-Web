import { Modal, Button, Radio } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import FingerprintJS, { Agent, GetResult } from '@fingerprintjs/fingerprintjs';

import styles from './productModal.module.scss';
import { useAppSelector } from '../../../app/hooks';
import { selectAcceptedTermsAndConditions } from '../../productExplorer/productExplorerSlice';

import { useRunAuditLogMutation } from '../../../services/auditLogService';

// Pre‑load the FingerprintJS agent once per bundle load
const fpPromise = FingerprintJS.load();

interface ProductModalProps {
  isVisible: boolean;
  isWithdraw: boolean;
  url?: string;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isVisible,
  isWithdraw,
  url,
  onClose,
}) => {
  console.log('Rendering ProductModal');
  const acceptedTerms = useAppSelector(selectAcceptedTermsAndConditions);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );
  const [understandExternalWebsite, setUnderstandExternalWebsite] =
    useState(false);
  const [visitorId, setVisitorId] = useState<string | undefined>(undefined);

  // Resolve the probabilistic fingerprint once per component mount
  useEffect(() => {
    let mounted = true;
    fpPromise
      .then((fp: Agent) => fp.get())
      .then((result: GetResult) => {
        if (mounted) setVisitorId(result.visitorId);
      })
      .catch(() => {
        if (mounted) setVisitorId(undefined);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const [runAuditLog] = useRunAuditLogMutation();

  const handleClick = useCallback(() => {
    void runAuditLog({
      request: {
        timestamp: new Date().toLocaleString(undefined, {
          timeZoneName: 'long',
        }),
        user: visitorId ?? 'unknown', // probabilistic fingerprint id
        page: isWithdraw
          ? 'productDetail-withdraw-redirect'
          : 'productDetail-deposit-redirect',
        tosAgreement: understandExternalWebsite ? 'accepted' : 'not accepted',
      },
    });
    window.open(url, '_blank');
    clearInterval(intervalId);
    setIntervalId(undefined);
    onClose();
  }, [
    runAuditLog,
    isWithdraw,
    understandExternalWebsite,
    url,
    intervalId,
    onClose,
    visitorId,
  ]);

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          {isWithdraw ? 'Remove Liquidity' : 'Add liquidity'}
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      className={styles.depositModal}
      width={600}
    >
      <div style={{ width: '100%', height: '100%' }}>
        <h5>Redirection to external website</h5>
        <p>
          The website or web pages to which you are redirected are not owned by
          QuantAMM. QuantAMM therefore shall not be held liable for any
          information, data, details, explanations and representations
          (hereinafter referred to as &quot;Information&quot;) provided on such
          websites, in particular not for damages that may result from the use
          of this Information for your own investment decisions. Price and
          performance data on the websites of QuantAMM may differ from the price
          information on the websites of the respective online brokers or banks.
        </p>

        <p>
          The information on the websites to which you are redirected is the
          sole responsibility of their providers. The offers you find on the
          providers&apos; websites are expressly not directed at persons in
          countries that prohibit the provision or retrieval of the content
          posted therein. Each user is responsible for finding out about any
          restrictions before accessing the websites and complying with them.
        </p>
      </div>
      <div className={styles.radioContainer}>
        <Radio
          onClick={() =>
            setUnderstandExternalWebsite(!understandExternalWebsite)
          }
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
          disabled={!understandExternalWebsite || !acceptedTerms}
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <img
            src="/assets/logo-balancer.png"
            alt="Balancer"
            className={styles.modalIcon}
            style={{ marginBottom: '10px', marginTop: '10px' }}
          />
          <div className={styles.modalContent} style={{ width: '100%' }}>
            <span className={styles.modalTitle} style={{ textAlign: 'center' }}>
              {isWithdraw ? 'Withdraw' : 'Deposit'} on Balancer
            </span>
            <p
              className={styles.modalDescription}
              style={{
                wordWrap: 'break-word',
                width: '100%',
                maxWidth: '500px',
                textAlign: 'center',
                marginBottom: 0,
              }}
            >
              Continue to Balancer&apos;s website
            </p>
            <p
              style={{
                wordWrap: 'break-word',
                width: '100%',
                textAlign: 'center',
                marginTop: '0',
              }}
            >
              where you can {isWithdraw ? 'withdraw' : 'deposit'} your assets.
            </p>
          </div>
        </Button>
      </div>
    </Modal>
  );
};
