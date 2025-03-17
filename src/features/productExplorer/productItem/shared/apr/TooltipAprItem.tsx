// import {
//   BoxProps,
//   Box,
//   HStack,
//   Text,
//   Portal,
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from '@chakra-ui/react'
import { Typography, Popover } from 'antd';
import BigNumber from 'bignumber.js';
import { ReactNode } from 'react';

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
  // aprOpacity = 1,
  displayValueFormatter,
  // boxBackground,
  // bg = 'background.level3',
  textBackground,
  textBackgroundClip,
  children,
  fontWeight,
  fontColor,
  // textVariant,
  tooltipText,
  valueFontColor,
}: PopoverAprItemProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          <Popover trigger="hover">
            <Text
              // className="tooltip-dashed-underline"
              color={valueFontColor ?? fontColor}
              // fontSize="sm"
              // fontWeight={fontWeight}
              // opacity={aprOpacity}
              // variant={textVariant}
            >
              {displayValueFormatter(apr)}
            </Text>
            {/* <Portal> */}
            {/* <PopoverContent maxW="300px" p="sm" w="auto"> */}
            <Text style={{ fontSize: '14px', color: '#666666' }}>
              {tooltipText}
            </Text>
            {/* </PopoverContent> */}
            {/* </Portal> */}
          </Popover>
        ) : (
          <Text
            color={valueFontColor ?? fontColor}
            // fontSize="sm"
            // fontWeight={fontWeight}
            // opacity={aprOpacity}
            // variant={textVariant}
          >
            {displayValueFormatter(apr)}
          </Text>
        )}
      </div>
      {children}
    </div>
  );
}
