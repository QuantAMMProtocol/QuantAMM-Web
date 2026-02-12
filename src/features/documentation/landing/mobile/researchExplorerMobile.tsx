import { Button, Card, Collapse } from 'antd';
import styles from './landingMobile.module.css';

import {
  BarChartOutlined,
  HourglassOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

export function ResearchExplorerMobile() {
  const researchCards = [
    {
      title: 'TFMM Litepaper',
      description:
        'A detailed explanation of the underlying AMM mechanism that makes QuantAMM possible.',
      link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c2381409947dc42c7a_TFMM_litepaper.pdf',
      icon: <PieChartOutlined />,
    },
    {
      title: 'QuantAMM Litepaper',
      description:
        'Blockchain Traded Funds: their construction, strategy tuning, and application.',
      link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c260d10f98e065f1ea_QuantAMM_Litepaper.pdf',
      icon: <HourglassOutlined />,
    },
    {
      title: 'RVR - Improving the fidelity of Loss-versus-Rebalancing',
      description:
        'A comparison of TFMM rebalancing for fund managers compared to running CEX portfolios',
      link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/672283811331fc9bef39be23_RVR_30_10_24.pdf',
      icon: <BarChartOutlined className={styles.researchIcon} />,
    },
  ];

  return (
    <div className={styles.mobileSection}>
      <Collapse
        items={[
          {
            key: '1',
            label: 'Explore Our Research',
            children: researchCards.map((paper, index) => (
              <Card
                key={index}
                title={
                  <>
                    {paper.icon} {paper.title}
                  </>
                }
                className={styles.researchCard}
              >
                <p>{paper.description}</p>
                <Button href={paper.link}>View Full Paper</Button>
              </Card>
            )),
          },
        ]}
      />
    </div>
  );
}
