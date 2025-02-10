import React, { useState } from 'react';
import { Button, Card, Col, Row } from 'antd';

interface FilterProps {
  onFilterChange: (filters: {
    marketType: string[];
    sector: string[];
    investmentWindow: string[];
  }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedMarketTypes, setSelectedMarketTypes] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedInvestmentWindows, setSelectedInvestmentWindows] = useState<
    string[]
  >([]);

  const handleMarketTypeChange = (value: string) => {
    const updatedSelectedMarketTypes = [...selectedMarketTypes];
    if (updatedSelectedMarketTypes.includes(value)) {
      updatedSelectedMarketTypes.splice(
        updatedSelectedMarketTypes.indexOf(value),
        1
      );
    } else {
      updatedSelectedMarketTypes.push(value);
    }
    setSelectedMarketTypes(updatedSelectedMarketTypes);
    onFilterChange({
      marketType: updatedSelectedMarketTypes,
      sector: selectedSectors,
      investmentWindow: selectedInvestmentWindows,
    });
  };

  const handleSectorChange = (value: string) => {
    const updatedSelectedSectors = [...selectedSectors];
    if (updatedSelectedSectors.includes(value)) {
      updatedSelectedSectors.splice(updatedSelectedSectors.indexOf(value), 1);
    } else {
      updatedSelectedSectors.push(value);
    }
    setSelectedSectors(updatedSelectedSectors);
    onFilterChange({
      marketType: selectedMarketTypes,
      sector: updatedSelectedSectors,
      investmentWindow: selectedInvestmentWindows,
    });
  };

  const handleInvestmentWindowChange = (value: string) => {
    const updatedSelectedInvestmentWindows = [...selectedInvestmentWindows];
    if (updatedSelectedInvestmentWindows.includes(value)) {
      updatedSelectedInvestmentWindows.splice(
        updatedSelectedInvestmentWindows.indexOf(value),
        1
      );
    } else {
      updatedSelectedInvestmentWindows.push(value);
    }
    setSelectedInvestmentWindows(updatedSelectedInvestmentWindows);
    onFilterChange({
      marketType: selectedMarketTypes,
      sector: selectedSectors,
      investmentWindow: updatedSelectedInvestmentWindows,
    });
  };

  return (
    <div>
      <Row>
        <Col span={3}>Market Condition</Col>
        <Col span={21}>
          <Row>
            <Col span={24}>
              <Button.Group style={{ width: '100%', display: 'flex' }}>
                <Button
                  type={
                    selectedMarketTypes.includes('bull') ? 'primary' : 'default'
                  }
                  onClick={() => handleMarketTypeChange('bull')}
                >
                  Bull
                </Button>
                <Button
                  type={
                    selectedMarketTypes.includes('bear') ? 'primary' : 'default'
                  }
                  onClick={() => handleMarketTypeChange('bear')}
                >
                  Bear
                </Button>
                <Button
                  type={
                    selectedMarketTypes.includes('adaptive')
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => handleMarketTypeChange('adaptive')}
                >
                  Adaptive
                </Button>
                <Button
                  type={
                    selectedMarketTypes.includes('composite')
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => handleMarketTypeChange('composite')}
                >
                  Composite
                </Button>
              </Button.Group>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={3}>Constituent Sector</Col>
        <Col span={21}>
          <Col span={3}></Col>
          <Col span={18}>
            <Button.Group>
              <Button
                type={
                  selectedSectors.includes('infrastructure')
                    ? 'primary'
                    : 'default'
                }
                onClick={() => handleSectorChange('infrastructure')}
              >
                Infrastructure
              </Button>
              <Button
                type={
                  selectedSectors.includes('mega cap') ? 'primary' : 'default'
                }
                onClick={() => handleSectorChange('mega cap')}
              >
                Mega Cap
              </Button>
              <Button
                type={
                  selectedSectors.includes('alt coins') ? 'primary' : 'default'
                }
                onClick={() => handleSectorChange('alt coins')}
              >
                Alt Coins
              </Button>
              <Button
                type={
                  selectedSectors.includes('stables') ? 'primary' : 'default'
                }
                onClick={() => handleSectorChange('stables')}
              >
                Stables
              </Button>
            </Button.Group>
          </Col>
          <Col span={3}></Col>
        </Col>
      </Row>
      <Row>
        <Col span={3}>Investment Window</Col>
        <Col span={21}>
          <Col span={3}></Col>
          <Col span={18}>
            <Button.Group>
              <Button
                type={
                  selectedInvestmentWindows.includes('day')
                    ? 'primary'
                    : 'default'
                }
                onClick={() => handleInvestmentWindowChange('day')}
              >
                Day
              </Button>
              <Button
                type={
                  selectedInvestmentWindows.includes('week')
                    ? 'primary'
                    : 'default'
                }
                onClick={() => handleInvestmentWindowChange('week')}
              >
                Week
              </Button>
              <Button
                type={
                  selectedInvestmentWindows.includes('month')
                    ? 'primary'
                    : 'default'
                }
                onClick={() => handleInvestmentWindowChange('month')}
              >
                Month
              </Button>
              <Button
                type={
                  selectedInvestmentWindows.includes('year')
                    ? 'primary'
                    : 'default'
                }
                onClick={() => handleInvestmentWindowChange('year')}
              >
                Year
              </Button>
            </Button.Group>
          </Col>
          <Col span={3}></Col>
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={2}></Col>
        <Col span={20}>
          <Row>
            <Col span={5}>
              <Card title="Card title" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Row>
                <Col span={24}>
                  <Card title="Card title" bordered={true}>
                    Card content
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Card title="Card title" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Card title="Card title" bordered={true}>
                Card content
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: '50px' }}>
            <Col span={5}>
              <Card title="Card title" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Row>
                <Col span={24}>
                  <Card title="Card title" bordered={true}>
                    Card content
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Card title="Card title" bordered={true}>
                Card content
              </Card>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
              <Card title="Card title" bordered={true}>
                Card content
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={2}></Col>
      </Row>
    </div>
  );
};

export default Filter;
