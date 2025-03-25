import { CSSProperties, ReactNode } from 'react';
import { Typography, Popover } from 'antd';
import BigNumber from 'bignumber.js';

import styles from './AprTooltip.module.scss';

const { Text } = Typography;

interface PopoverAprItemProps extends CSSProperties {
  fontWeight?: number | string;
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

export const TooltipAprItem = ({
  title,
  apr,
  aprOpacity = 1,
  displayValueFormatter,
  boxBackground,
  textBackground,
  textBackgroundClip,
  children,
  fontWeight,
  fontColor,
  tooltipText,
  valueFontColor,
  ...props
}: PopoverAprItemProps) => {
  return (
    <div
      className={styles['tooltip-item__container']}
      style={{ background: boxBackground, ...props }}
    >
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
              <div className={styles['tooltip-text']}>
                <Text
                  style={{
                    fontSize: '16px',
                  }}
                >
                  {tooltipText}
                </Text>
              </div>
            }
          >
            <Text
              className={styles['tooltip-dashed-underline']}
              style={{
                color: valueFontColor ?? fontColor,
                fontSize: '14px',
                fontWeight: fontWeight,
                opacity: aprOpacity,
              }}
            >
              {displayValueFormatter(apr)}
            </Text>
          </Popover>
        ) : (
          <Text
            style={{
              color: valueFontColor ?? fontColor,
              fontSize: '14px',
              fontWeight: fontWeight,
              opacity: aprOpacity,
            }}
          >
            {displayValueFormatter(apr)}
          </Text>
        )}
      </div>
      {children}
    </div>
  );
};
