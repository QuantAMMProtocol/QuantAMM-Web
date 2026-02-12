import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Button,
  Checkbox,
  Alert,
  Space,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import {
  selectAcceptedTermsAndConditions,
  setAcceptedTermsAndConditions,
} from '../../productExplorer/productExplorerSlice';
import { ROUTES } from '../../../routesEnum';
import { useRunAuditLogMutation } from '../../../services/auditLogService';
import { LOC_COOKIE, setCookie } from '../../productExplorer/cookieUtils';
import {
  buildTosAuditLogRequest,
  isContinueEnabledForLocation,
  LocationChoice,
  shouldRedirectToIneligible,
} from './termsOfServiceModalUtils';

const { Title, Paragraph, Text } = Typography;

export interface TermsOfServiceGateModalProps {
  tosUrl?: string;
  onClose: () => void;
  isUkIp?: boolean;
  isMobile?: boolean;
  page: string;
}

// ---------- (Existing modal content preserved) ----------
const ToSSummary: React.FC = () => (
  <Typography>
    <InfoCircleOutlined />
    <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
      Key points (summary)
    </Title>
    <Paragraph style={{ marginBottom: 8 }}>
      <Paragraph>
        Access to the site and its services is strictly prohibited for users
        located in or citizens of Restricted Territories, including the United
        Kingdom, United States, Canada, and other sanctioned jurisdictions,
        unless explicitly permitted.
      </Paragraph>
      <Paragraph>
        Use of VPNs or anonymizing tools to bypass access restrictions is
        forbidden and violates the Terms of Service.
      </Paragraph>
      <Paragraph>
        <Text strong>Cryptoassets are highly volatile</Text>. You may lose the
        entire value of your holdings. There is no Financial Services
        Compensation Scheme (FSCS) or equivalent protection. Risks are numerous
        and include market, price, currency, liquidity. Conduct your own
        research into the risks.
      </Paragraph>
      <Paragraph>
        QuantAMM is an advanced Decentralized Finance (DeFi) platform. This
        introduces unique smart contract and regulatory risks that may cause you
        to lose the entire value of your holdings. QuantAMM reserves the right
        to remove access to the platform at any time and for any reason.
        QuantAMM cannot remove access to your underlying capital as the platform
        is non-custodial.
      </Paragraph>
      <Paragraph>
        QuantAMM does not offer investment advice. Simulations and past
        performance are not indicative of future results. This site and its
        materials do not constitute a financial promotion, advertisement, or
        offer of investment services. Access is limited to eligible users only
        and does not imply solicitation or regulatory approval.
      </Paragraph>
      <Paragraph>
        Users are solely responsible for complying with applicable laws, tax
        obligations, and ensuring they are eligible to use the platform. The
        platform is non-custodial and users interact directly with smart
        contracts at their own risk.
      </Paragraph>
      <Paragraph>
        By using the platform, you agree to indemnify QuantAMM against any
        claims or losses arising from your activity. QuantAMM’s liability is
        strictly limited to the fees you have paid in the two months prior to
        any claim.
      </Paragraph>
    </Paragraph>
  </Typography>
);

const TermsOfServiceGateModal: React.FC<TermsOfServiceGateModalProps> = ({
  tosUrl,
  onClose,
  isUkIp = false,
  isMobile = false,
  page,
}) => {
  const dispatch = useAppDispatch();
  const acceptedTerms = useAppSelector(selectAcceptedTermsAndConditions);
  const [location, setLocation] = useState<LocationChoice>('');
  const [acceptedTos, setAcceptedTos] = useState(false);
  const [continueEnabled, setContinueEnabled] = useState(false);
  const [runAuditLog] = useRunAuditLogMutation();
  const showUkBanner = isUkIp || location === 'uk';
  const tosHref = tosUrl ?? 'https://quantamm.fi/tos';

  useEffect(() => {
    setContinueEnabled(isContinueEnabledForLocation(location));
  }, [location]);

  const handleContinue = useCallback(() => {
    try {
      const entry = { ts: Date.now(), location };
      sessionStorage.setItem('quantamm-gate', JSON.stringify(entry));
    } catch {
      /* no-op */
    }

    setCookie(LOC_COOKIE, location || '');

    if (shouldRedirectToIneligible(location, continueEnabled)) {
      window.location.href = '/' + ROUTES.INELIGIBLEUSER;
      return;
    }

    dispatch(setAcceptedTermsAndConditions(true));

    void runAuditLog({
      request: buildTosAuditLogRequest({
        hostname: window.location.hostname,
        page,
        isMobile,
      }),
    });

    onClose();
  }, [
    location,
    runAuditLog,
    page,
    isMobile,
    continueEnabled,
    dispatch,
    onClose,
  ]);

  const renderContent = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row>
        <Col span={24}>
          <p style={{ marginBottom: 0, paddingLeft: 5, textAlign: 'center' }}>
            Select Location:
            <span
              style={{
                margin: 0,
                padding: 0,
                color: location !== '' ? 'transparent' : 'red',
                textAlign: 'right',
              }}
            >
              *required
            </span>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button
              size="small"
              type={location === 'uk' ? 'primary' : 'default'}
              block
              onClick={() => setLocation('uk')}
              style={{ height: '50px' }}
            >
              I am accessing from inside the United Kingdom.
            </Button>
            <Button
              size="small"
              type={location === 'nonUk' ? 'primary' : 'default'}
              block
              onClick={() => setLocation('nonUk')}
              style={{ height: '50px' }}
            >
              I am accessing from outside the United Kingdom.
            </Button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Checkbox
              style={{ marginTop: 10 }}
              checked={acceptedTos}
              onChange={(e) => setAcceptedTos(e.target.checked)}
            >
              I have read and accept the{' '}
              <a href={tosHref} target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and confirm I am not a prohibited user.{' '}
              <span
                style={{
                  margin: 0,
                  padding: 0,
                  color: acceptedTos ? 'transparent' : 'red',
                  textAlign: 'right',
                }}
              >
                *required
              </span>
            </Checkbox>
          </div>
        </Col>

        <Col span={24}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Button
              type="primary"
              disabled={!acceptedTos || location !== 'nonUk'}
              onClick={handleContinue}
              style={{
                width: '90%',
                height: '50px',
                marginBottom: 20,
                marginTop: 10,
              }}
            >
              Continue
            </Button>
          </div>
        </Col>
      </Row>
    </Space>
  );

  return acceptedTerms ? null : (
    <Modal
      title={'Access Confirmation'}
      centered
      open={!acceptedTerms}
      footer={null}
      closable={false}
      width={isMobile ? 360 : 960}
      styles={{
        mask: { backdropFilter: 'blur(8px)' },
        body: { maxHeight: isMobile ? '90vh' : '90vh', overflowY: 'auto' },
      }}
      destroyOnClose
    >
      <div style={{ height: isMobile ? '250px' : '400px', overflowY: 'auto' }}>
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
          <Alert type="info" description={<ToSSummary />} className="mb-4" />
        )}
      </div>

      <Paragraph type="secondary" style={{ fontSize: 12 }}>
        This summary does <Text underline>not</Text> replace the{' '}
        <a href={tosHref} style={{ fontWeight: 'bold' }}>
          full Terms of Service
        </a>
        . Please read the complete document before proceeding.
      </Paragraph>

      {renderContent()}
    </Modal>
  );
};

export default TermsOfServiceGateModal;
