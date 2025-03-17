import { Typography, Popover } from 'antd';
import BigNumber from 'bignumber.js';
import { ReactNode } from 'react';

import styles from './AprTooltip.module.scss';

const { Text } = Typography;

interface PopoverAprItemProps {
  fontWeight?: number;
  fontColor?: string;
  valueFontColor?: string;
  title: string;
  apr: BigNumber;
  aprOpacity?: number;
  displayValueFormatter: (value: BigNumber) => string;
  boxBackground?: string;
  textBackground?: string;
  textBackgroundClip?: string;
  tooltipText?: string;
  textVariant?: string;
  children?: ReactNode;
}

export function TooltipAprItem({
  title,
  apr,
  displayValueFormatter,
  textBackground,
  textBackgroundClip,
  children,
  fontWeight,
  fontColor,
  tooltipText,
  valueFontColor,
}: PopoverAprItemProps) {
  return (
    <div className={styles['tooltip-item__container']}>
      <div className={styles['tooltip-item']}>
        <Text
          style={{
            background: textBackground,
            backgroundClip: textBackgroundClip,
            color: fontColor,
            fontSize: '14px',
            fontWeight: fontWeight,
          }}
        >
          {title}
        </Text>
        {tooltipText ? (
          <Popover
            trigger="hover"
            content={
              <div style={{ width: '300px' }}>
                <Text>{tooltipText}</Text>
              </div>
            }
          >
            <Text className={styles['tooltip-dashed-underline']}>
              {displayValueFormatter(apr)}
            </Text>
          </Popover>
        ) : (
          <Text color={valueFontColor ?? fontColor}>
            {displayValueFormatter(apr)}
          </Text>
        )}
      </div>
      {children}
    </div>
  );
}
