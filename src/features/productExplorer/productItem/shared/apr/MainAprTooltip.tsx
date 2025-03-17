// import {
//   Box,
//   Button,
//   Center,
//   HStack,
//   Icon,
//   PopoverContent,
//   Text,
//   TextProps,
//   useColorModeValue,
// } from '@chakra-ui/react';
import BaseAprTooltip, { BaseAprTooltipProps } from './BaseAprTooltip';
// import { Info } from 'react-feather';
import { getTotalAprLabel } from './pool.utils';
// import StarsIcon from '../../icons/StarsIcon';
// import { PoolListItem } from '@repo/lib/modules/pool/pool.types';
// import { FeaturedPool } from '@repo/lib/modules/pool/PoolProvider';
// import { Pool } from '@repo/lib/modules/pool/pool.types';
import { isLBP } from '../../../../../utils/poolHelpers';
// import { GqlPoolAprItemType } from '@repo/lib/shared/services/api/generated/graphql';
// import StarIcon from '../../icons/StarIcon';
// import { PROJECT_CONFIG } from '@repo/lib/config/getProjectConfig';
// import { isPool } from '@repo/lib/modules/pool/pool-tokens.utils';
import { Product } from '../../../../../models';
// import { useAppSelector } from '../../../../../app/hooks';
// import { selectTheme } from '../../../../themes/themeSlice';
// import { Box, Icon, Info } from 'lucide-react';
import {
  GqlChain,
  GqlPoolAprItemType,
} from '../../../../../__generated__/graphql-types';
import { Button } from 'antd';
import { Popover, Typography } from 'antd';
import Icon from '@ant-design/icons';
// import { useAppSelector } from '../../../../../app/hooks';
// import { selectTheme } from '../../../../themes/themeSlice';
import { Info, StarIcon } from 'lucide-react';

const { Text } = Typography;

interface Props
  extends Omit<
    BaseAprTooltipProps,
    | 'children'
    | 'totalBaseText'
    | 'totalBaseVeBalText'
    | 'maxVeBalText'
    | 'poolType'
  > {
  // textProps?: TextProps;
  onlySparkles?: boolean;
  aprLabel?: boolean;
  apr?: string;
  height?: string;
  product: Product;
  id?: string;
}

export function SparklesIcon({
  isOpen,
  product,
  id,
}: {
  isOpen: boolean;
  product: Product;
  id?: string;
}) {
  // const isDark = useAppSelector(selectTheme);

  const hoverColor = isLBP(product.type) ? 'inherit' : 'font.highlight';

  // const hasRewardApr =
  //   (product.dynamicData?.aprItems ?? []).filter((item) =>
  //     [GqlPoolAprItemType.Staking, GqlPoolAprItemType.VebalEmissions].includes(
  //       item.type
  //     )
  //   ).length > 0;

  const hasOnlySwapApr =
    (product.dynamicData?.aprItems ?? []).filter(
      (item) => item.type === GqlPoolAprItemType.SwapFee_24H
    ).length === (product.dynamicData?.aprItems ?? []).length;

  // const defaultGradFrom = isDark ? '#A0AEC0' : '#91A1B6';
  // const defaultGradTo = isDark ? '#BCCCE1' : '#E9EEF5';

  // const corePoolGradFrom = isDark ? '#AE8C56' : '#BFA672';
  // const corePoolGradTo = isDark ? '#D9C47F' : '#F4EAD2';

  // const rewardsGradFrom = isDark ? '#F49175' : '#F49A55';
  // const rewardsGradTo = isDark ? '#FCD45B' : '#FFCC33';

  // let gradFromColor = defaultGradFrom;
  // let gradToColor = defaultGradTo;

  // TODO check if this is correct
  // if (product.id === PROJECT_CONFIG.corePoolId) {
  //   gradFromColor = corePoolGradFrom;
  //   gradToColor = corePoolGradTo;
  // }

  // if (hasRewardApr) {
  //   gradFromColor = rewardsGradFrom;
  //   gradToColor = rewardsGradTo;
  // }

  return (
    <div style={{ height: 'auto', minWidth: '16px', width: '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
        }}
      >
        {isLBP(product.type) ? (
          <Icon
            component={Info}
            // boxSize={4}
            color={isOpen ? hoverColor : 'gray.400'}
          />
        ) : hasOnlySwapApr ? (
          <Icon
            component={StarIcon}
            // boxSize={4}
            // gradFrom={isOpen ? 'green' : defaultGradFrom}
            // gradTo={isOpen ? 'green' : defaultGradTo}
            id={id ?? ''}
          />
        ) : (
          <Icon
            component={StarIcon}
            // gradFrom={isOpen ? 'green' : gradFromColor}
            // gradTo={isOpen ? 'green' : gradToColor}
            id={id ?? ''}
          />
        )}
      </div>
    </div>
  );
}

function MainAprTooltip({
  onlySparkles,
  // textProps,
  apr,
  vebalBoost,
  aprLabel,
  // height = '16px',
  product,
  id,
  ...props
}: Props) {
  const aprToShow =
    apr ??
    (product.dynamicData?.aprItems &&
      getTotalAprLabel(product.dynamicData?.aprItems, vebalBoost));

  const hoverColor = isLBP(product.type) ? 'inherit' : 'font.highlight';

  const customPopoverContent = isLBP(product.type) ? (
    <Popover>
      <Text>LBP APRs cannot be realized by LPs.</Text>
    </Popover>
  ) : undefined;

  return (
    <BaseAprTooltip
      {...props}
      chain={product.chain as GqlChain}
      customPopoverContent={customPopoverContent}
      // hookType={isPool(product) ? product.hook?.type : undefined}
      maxVeBalText="Total max veBAL APR"
      poolType={product.type}
      totalBaseText={(hasVeBalBoost) =>
        `Total ${hasVeBalBoost ? 'base' : ''} APR`
      }
      totalBaseVeBalText="Total base APR"
      vebalBoost={vebalBoost}
    >
      {({ isOpen }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
          // _focus={{ outline: 'none' }}
          // h={height}
          // px="0"
          // variant="unstyled"
          >
            <div
              // _hover={{ color: hoverColor }}
              style={{
                color: isOpen ? hoverColor : 'font.primary',
                gap: 'xs',
                opacity: isLBP(product.type) ? 0.5 : 1,
              }}
            >
              {!onlySparkles && (
                <Text
                  style={{
                    color: isOpen ? hoverColor : 'font.primary',
                    textAlign: 'left',
                    textDecoration: isLBP(product.type)
                      ? 'line-through'
                      : 'none',
                    whiteSpace: 'pre-wrap',
                  }}
                  // {...textProps}
                >
                  {apr ?? aprToShow}
                  {aprLabel ? ' APR' : ''}
                </Text>
              )}
              <SparklesIcon id={id} isOpen={isOpen} product={product} />
            </div>
          </Button>
        </div>
      )}
    </BaseAprTooltip>
  );
}

export default MainAprTooltip;
