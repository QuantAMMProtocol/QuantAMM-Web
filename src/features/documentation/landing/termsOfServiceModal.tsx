import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Radio, Checkbox, Alert, Space, Typography } from 'antd';
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '../../../app/hooks';
import { selectAcceptedTermsAndConditions } from '../../productExplorer/productExplorerSlice';
import { ROUTES } from '../../../routesEnum';

const { Title, Paragraph, Text } = Typography;

export interface TermsOfServiceGateModalProps {
  tosUrl: string;
  onClose: () => void;
  isUkIp?: boolean;
  isMobile?: boolean;
}

type LocationChoice = '' | 'uk' | 'nonUk';

const ToSSummary: React.FC = () => (
  <Typography>
    <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
      Key points (summary)
    </Title>
    <Paragraph style={{ marginBottom: 8 }}>
      <ul style={{ paddingLeft: 18 }}>
        <li>
          Access to the site and its services is strictly prohibited for users
          located in or citizens of Restricted Territories, including the United
          Kingdom, United States, Canada, and other sanctioned jurisdictions,
          unless explicitly permitted.
        </li>
        <li>
          Use of VPNs or anonymizing tools to bypass access restrictions is
          forbidden and violates the Terms of Service.
        </li>
        <li>
          <Text strong>Cryptoassets are highly volatile</Text>. You may lose the
          entire value of your holdings. There is no Financial Services
          Compensation Scheme (FSCS) or equivalent protection. Risks are
          numerous and include market, price, currency, liquidity. Conduct your
          own research into the risks.
        </li>
        <li>
          QuantAMM is an advanced Decentralized Finance (DeFi) platform. This
          introduces unique smart contract and regulatory risks that may cause
          you to lose the entire value of your holdings. QuantAMM reserves the
          right to remove access to the platform at any time and for any reason.
          QuantAMM cannot remove access to your underlying capital as the
          platform is non-custodial.
        </li>
        <li>
          QuantAMM does not offer investment advice. Simulations and past
          performance are not indicative of future results. This site and its
          materials do not constitute a financial promotion, advertisement, or
          offer of investment services. Access is limited to eligible users only
          and does not imply solicitation or regulatory approval.
        </li>
        <li>
          Users are solely responsible for complying with applicable laws, tax
          obligations, and ensuring they are eligible to use the platform. The
          platform is non-custodial and users interact directly with smart
          contracts at their own risk.
        </li>
        <li>
          By using the platform, you agree to indemnify QuantAMM against any
          claims or losses arising from your activity. QuantAMM’s liability is
          strictly limited to the fees you have paid in the two months prior to
          any claim.
        </li>
      </ul>
    </Paragraph>
  </Typography>
);

const TermsOfServiceGateModal: React.FC<TermsOfServiceGateModalProps> = ({
  onClose,
  isUkIp = false,
  isMobile = false,
}) => {
  const acceptedTerms = useAppSelector(selectAcceptedTermsAndConditions);
  const [location, setLocation] = useState<LocationChoice>('');
  const [acceptedTos, setAcceptedTos] = useState(false);
  const [continueEnabled, setContinueEnabled] = useState(false);

  const showUkBanner = isUkIp || location === 'uk';

  useEffect(() => {
    if (location === 'nonUk') {
      setContinueEnabled(true);
    } else {
      setContinueEnabled(false);
    }
  }, [location]);

  const handleContinue = useCallback(() => {
    const entry = {
      ts: Date.now(),
      location,
    };
    try {
      sessionStorage.setItem('quantamm-gate', JSON.stringify(entry));
    } catch {
      /* empty */
    }
    if (!continueEnabled || location === 'uk') {
      window.location.href = '/' + ROUTES.INELIGIBLEUSER;
    } else {
      console.log('Accepted terms:', entry);

      onClose();
      console.log(acceptedTerms);
    } // ✅ Close the modal only
  }, [location, continueEnabled, onClose, acceptedTerms]);

  const renderContent = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Radio.Group
        block
        optionType="button"
        buttonStyle="solid"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value as LocationChoice);
        }}
        style={{ display: 'block' }}
      >
        <Radio value="uk">I am accessing from inside the United Kingdom.</Radio>
        <Radio value="nonUk">
          I am accessing from outside the United Kingdom.
        </Radio>
      </Radio.Group>
      <Checkbox
        checked={acceptedTos}
        onChange={(e) => setAcceptedTos(e.target.checked)}
      >
        I have read and accept the{' '}
        <a
          href={'https://quantamm.fi/tos'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </a>{' '}
        and confirm I am not a prohibited user.
      </Checkbox>

      <div style={{ textAlign: 'right' }}>
        <Button type="primary" disabled={!acceptedTos} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </Space>
  );

  return (
    <Modal
      title={'Access Confirmation'}
      centered
      open={!acceptedTerms}
      footer={null}
      closable={false}
      width={isMobile ? 360 : 820}
      styles={{
        mask: { backdropFilter: 'blur(8px)' },
        body: { maxHeight: isMobile ? '80vh' : '70vh', overflowY: 'auto' },
      }}
      destroyOnClose
    >
      <div style={{ height: '400px', overflowY: 'auto' }}>
        {showUkBanner ? (
          <Alert
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            description={
              <>
                <p style={{ marginBottom: 12, fontWeight: 500 }}>
                  Cryptoassets are high‑risk. You could lose all the money you
                  invest. No FSCS protection. Tax may apply. For professional
                  investors only — not for UK retail clients.
                </p>
                <ToSSummary />
              </>
            }
            className="mb-4"
          />
        ) : (
          <Alert
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            description={<ToSSummary />}
            className="mb-4"
          />
        )}
      </div>
      <Paragraph type="secondary" style={{ fontSize: 12 }}>
        This summary does <Text underline>not</Text> replace the{' '}
        <a href={'https://quantamm.fi/tos'} style={{ fontWeight: 'bold' }}>
          full Terms of Service
        </a>
        . Please read the complete document before proceeding.
      </Paragraph>
      {renderContent()}
    </Modal>
  );
};

export default TermsOfServiceGateModal;
