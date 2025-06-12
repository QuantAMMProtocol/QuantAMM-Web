import { Col, Row } from 'antd';

export default function InegligibleUser() {
    return (
        <Row
        style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
        <Col>
            <h1>:(</h1>
            <p>
            You are not eligible to use this application. Please contact info@quantamm.fi
            for more information.
            </p>
            <h1>Ineligibility is due to a breach of Terms of Service conditions such as the user is from an ineligible location</h1>
            <button
                onClick={() => window.location.href = '/tos'}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                View Terms of Service
            </button>
        </Col>
        </Row>
    );
    }
