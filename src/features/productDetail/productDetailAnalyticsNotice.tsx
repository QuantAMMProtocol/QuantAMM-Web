import { FC, memo } from 'react';

import styles from './productDetailAnalyticsNotice.module.scss';

const NOTICE_MESSAGE =
  'Token pricing API is currently down for analytics only. LP token pricing on the balancer page and the QuantAMM landing page is still active';

export const ProductDetailAnalyticsNotice: FC = memo(
  function ProductDetailAnalyticsNoticeImpl() {
    return (
      <div
        className={styles.notice}
        role="status"
        aria-live="polite"
      >
        {NOTICE_MESSAGE}
      </div>
    );
  }
);
