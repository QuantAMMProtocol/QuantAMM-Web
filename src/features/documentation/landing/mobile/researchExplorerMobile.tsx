import { Button, Card, Collapse } from "antd";

import {
    HourglassOutlined,
    PieChartOutlined,
  } from '@ant-design/icons';

const { Panel } = Collapse;

export function ResearchExplorerMobile(){
    return <div style={{ padding: '20px' }}>
    <Collapse>
      <Panel header="Explore Our Research" key="1">
        {[
          {
            title: 'Temporal Function Market Making Litepaper',
            description:
              'A detailed explanation of the underlying AMM mechanism that makes QuantAMM possible.',
            link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c2381409947dc42c7a_TFMM_litepaper.pdf',
            icon: <PieChartOutlined />,
          },
          {
            title: 'QuantAMM Protocol Litepaper',
            description:
              'Blockchain Traded Funds: their construction, strategy tuning, and application.',
            link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c260d10f98e065f1ea_QuantAMM_Litepaper.pdf',
            icon: <HourglassOutlined />,
          },
        ].map((paper, index) => (
          <Card
            key={index}
            title={
              <>
                {paper.icon} {paper.title}
              </>
            }
            style={{ marginBottom: '10px' }}
          >
            <p>{paper.description}</p>
            <Button href={paper.link}>View Full Paper</Button>
          </Card>
        ))}
      </Panel>
    </Collapse>
  </div>
}