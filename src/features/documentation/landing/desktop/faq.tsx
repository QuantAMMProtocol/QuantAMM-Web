import { Col, Row, Steps } from "antd";
import { ProductItemBackground } from "../../../productExplorer/productItem/productItemBackground";


export function FAQ () {
    return <ProductItemBackground
    wide={true}
    layers={20}
    backgroundColourOverride="#FFFEF2"
    borderColourOverride="#f6f4ef"
  >
    <Row style={{ marginTop: '15vh' }}>
        <Col span={24}>
            <h1>FAQ</h1>
        </Col>
        <Col span={24}>
            <Steps
                style={{width: '100%'}}
                current={1}
                direction="horizontal"
                items={[
                {
                    title: 'What makes BTFs different from strategy vaults?',
                    description: 'something something',
                },
                {
                    title: 'How do BTFs rebalance holdings?',
                    description: 'something something',
                },
                {
                    title: 'If I am running a fund why not run it on a CEX?',
                    description: 'something something',
                },
                {
                    title: 'Do BTFs earn yield?',
                    description: 'something something',
                },
                {
                    title: 'Do BTFs earn yield?',
                    description: 'something something',
                },
                ]}
            />
        </Col>
    </Row>
    </ProductItemBackground>
}