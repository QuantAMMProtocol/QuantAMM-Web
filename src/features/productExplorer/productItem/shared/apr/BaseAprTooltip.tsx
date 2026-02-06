import { ReactNode, useState } from 'react';
import { Divider, Popover } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import BigNumber from 'bignumber.js';
import {
  GqlChain,
  GqlHookType,
  GqlPoolAprItem,
  GqlPoolType,
} from '../../../../../__generated__/graphql-types';
import { bn, fNum } from '../../../../../utils/numbers';
import { isCowAmmPool, isVebalPool } from '../../../../../utils/poolHelpers';
import { useAppSelector } from '../../../../../app/hooks';
import { selectTheme } from '../../../../themes/themeSlice';
import {
  swapFeesTooltipText,
  useAprTooltip,
  inherentTokenYieldTooltipText,
  extraBalTooltipText,
  lockingIncentivesTooltipText,
  votingIncentivesTooltipText,
  merklIncentivesTooltipText,
  surplusIncentivesTooltipText,
  SupportedHookType,
} from './useAprTooltip';
import { TooltipAprItem } from './TooltipAprItem';

import styles from './AprTooltip.module.scss';

interface Props {
  aprItems: GqlPoolAprItem[];
  numberFormatter?: (value: string) => BigNumber;
  displayValueFormatter?: (value: BigNumber) => string;
  placement?: TooltipPlacement;
  poolId: string;
  poolType: GqlPoolType;
  vebalBoost?: string;
  totalBaseText: string | ((hasVeBalBoost?: boolean) => string);
  totalBaseVeBalText: string;
  totalVeBalTitle?: string;
  maxVeBalText: string;
  customPopoverContent?: ReactNode;
  shouldDisplayBaseTooltip?: boolean;
  shouldDisplayMaxVeBalTooltip?: boolean;
  children?: ReactNode | (({ isOpen }: { isOpen: boolean }) => ReactNode);
  chain: GqlChain;
  hookType?: GqlHookType;
}

const balRewardGradient =
  'linear-gradient(90deg, var(--secondary-light) 0%,  var(--secondary-lighter) 100%)';

const defaultDisplayValueFormatter = (value: BigNumber) =>
  fNum('apr', value.toString());
const defaultNumberFormatter = (value: string) => bn(value);

function getDynamicSwapFeesLabel(hookType: GqlHookType) {
  switch (hookType) {
    case GqlHookType.MevTax:
      return 'MEV Capture hook';
    case GqlHookType.StableSurge:
      return 'Stable Surge hook';
    default:
      return 'Dynamic Swap Fees ';
  }
}

//TODO CH split components.
export const BaseAprTooltip = ({
  aprItems,
  poolId,
  numberFormatter,
  displayValueFormatter,
  placement,
  vebalBoost,
  customPopoverContent,
  totalBaseText,
  totalBaseVeBalText,
  totalVeBalTitle,
  maxVeBalText,
  shouldDisplayBaseTooltip,
  shouldDisplayMaxVeBalTooltip,
  children,
  poolType,
  chain,
  hookType,
}: Props) => {
  const isDark = useAppSelector(selectTheme);

  const [isOpen, setOpen] = useState(false);

  const usedDisplayValueFormatter =
    displayValueFormatter ?? defaultDisplayValueFormatter;
  const usedNumberFormatter = numberFormatter ?? defaultNumberFormatter;

  const {
    totalBaseDisplayed,
    extraBalAprDisplayed,
    yieldBearingTokensAprDisplayed,
    stakingIncentivesAprDisplayed,
    merklIncentivesAprDisplayed,
    merklTokensDisplayed,
    hasMerklIncentives,
    surplusIncentivesAprDisplayed,
    swapFeesDisplayed,
    isSwapFeePresent,
    isYieldPresent,
    isStakingPresent,
    maxVeBalDisplayed,
    yieldBearingTokensDisplayed,
    stakingIncentivesDisplayed,
    getSubitemPopoverAprItemProps,
    hasVeBalBoost,
    totalBase,
    maxVeBal,
    lockingAprDisplayed,
    votingAprDisplayed,
    isVotingPresent,
    isLockingAprPresent,
    totalCombinedDisplayed,
    isMaBeetsPresent,
    maBeetsRewardsDisplayed,
    maxMaBeetsRewardDisplayed,
    maxMaBeetsVotingRewardDisplayed,
    maBeetsVotingRewardsTooltipText,
    maBeetsTotalAprDisplayed,
    maBeetsRewardTooltipText,
    dynamicSwapFeesDisplayed,
    dynamicSwapFeesTooltipText,
  } = useAprTooltip({
    aprItems,
    vebalBoost: Number(vebalBoost),
    numberFormatter: usedNumberFormatter,
    chain,
  });

  const isVebal = isVebalPool(poolId);

  const totalBaseTitle = isVebal
    ? totalBaseVeBalText
    : typeof totalBaseText === 'function'
      ? totalBaseText(hasVeBalBoost)
      : totalBaseText;

  const popoverContent = customPopoverContent ?? (
    <div className={styles['popover-content']}>
      <TooltipAprItem
        {...{ paddingTop: '6px' }}
        apr={swapFeesDisplayed}
        aprOpacity={isSwapFeePresent ? 1 : 0.5}
        displayValueFormatter={usedDisplayValueFormatter}
        valueFontColor="var(--secondary-text-color)"
        title="Swap fees"
        tooltipText={swapFeesTooltipText}
      >
        {hookType ? (
          <>
            <TooltipAprItem
              {...getSubitemPopoverAprItemProps(isDark)}
              apr={bn(swapFeesDisplayed).minus(dynamicSwapFeesDisplayed)}
              displayValueFormatter={usedDisplayValueFormatter}
              title="Regular swap fees"
            />
            <TooltipAprItem
              {...getSubitemPopoverAprItemProps(isDark)}
              apr={dynamicSwapFeesDisplayed}
              displayValueFormatter={usedDisplayValueFormatter}
              title={getDynamicSwapFeesLabel(hookType)}
              valueFontColor="var(--secondary-text-color)"
              tooltipText={
                dynamicSwapFeesTooltipText[hookType as SupportedHookType]
              }
            />
          </>
        ) : null}
      </TooltipAprItem>

      {isMaBeetsPresent && (
        <TooltipAprItem
          apr={maBeetsRewardsDisplayed}
          displayValueFormatter={usedDisplayValueFormatter}
          title="Min maBEETS APR"
        />
      )}
      <TooltipAprItem
        apr={stakingIncentivesAprDisplayed}
        aprOpacity={isStakingPresent ? 1 : 0.5}
        displayValueFormatter={usedDisplayValueFormatter}
        title="Staking incentives"
      >
        {stakingIncentivesDisplayed.map((item) => {
          return (
            <TooltipAprItem
              {...getSubitemPopoverAprItemProps(isDark)}
              apr={item.apr}
              displayValueFormatter={usedDisplayValueFormatter}
              key={`staking-${item.title}-${item.apr.toString()}`}
              title={item.title}
              tooltipText={item.tooltipText}
              valueFontColor="var(--secondary-text-color)"
            />
          );
        })}
      </TooltipAprItem>
      <TooltipAprItem
        apr={yieldBearingTokensAprDisplayed}
        aprOpacity={isYieldPresent ? 1 : 0.5}
        displayValueFormatter={usedDisplayValueFormatter}
        title="Yield bearing tokens"
      >
        {yieldBearingTokensDisplayed.map((item) => {
          return (
            <TooltipAprItem
              {...getSubitemPopoverAprItemProps(isDark)}
              apr={item.apr}
              displayValueFormatter={usedDisplayValueFormatter}
              key={`yield-bearing-${item.title}-${item.apr.toString()}`}
              title={item.title}
              tooltipText={inherentTokenYieldTooltipText}
              valueFontColor="var(--secondary-text-color)"
            />
          );
        })}
      </TooltipAprItem>
      {hasMerklIncentives ? (
        <TooltipAprItem
          apr={merklIncentivesAprDisplayed}
          displayValueFormatter={usedDisplayValueFormatter}
          title="Merkl.xyz incentives"
          valueFontColor="var(--secondary-text-color)"
        >
          {merklTokensDisplayed.map((item) => {
            return (
              <TooltipAprItem
                {...getSubitemPopoverAprItemProps(isDark)}
                apr={item.apr}
                displayValueFormatter={usedDisplayValueFormatter}
                key={`merkl-${item.title}-${item.apr.toString()}`}
                title={item.title}
                tooltipText={merklIncentivesTooltipText}
                valueFontColor="var(--secondary-text-color)"
              />
            );
          })}
        </TooltipAprItem>
      ) : null}
      {isCowAmmPool(poolType) && (
        <TooltipAprItem
          apr={surplusIncentivesAprDisplayed}
          displayValueFormatter={usedDisplayValueFormatter}
          title="Prevented LVR"
          tooltipText={surplusIncentivesTooltipText}
          valueFontColor="var(--secondary-text-color)"
        />
      )}
      <Divider style={{ margin: 0 }} />
      <TooltipAprItem
        {...{ paddingLeft: '4px', paddingTop: '6px' }}
        apr={totalBaseDisplayed}
        displayValueFormatter={usedDisplayValueFormatter}
        title={totalBaseTitle}
        fontWeight={600}
        tooltipText={
          shouldDisplayBaseTooltip
            ? `${defaultDisplayValueFormatter(defaultNumberFormatter(totalBase.toString()))} APR`
            : ''
        }
      />
      {isVebal ? (
        <>
          <Divider style={{ margin: 0 }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            <TooltipAprItem
              {...{ paddingTop: '6px' }}
              apr={lockingAprDisplayed}
              aprOpacity={isLockingAprPresent ? 1 : 0.5}
              displayValueFormatter={usedDisplayValueFormatter}
              title="Protocol revenue share (max)"
              tooltipText={lockingIncentivesTooltipText}
              valueFontColor="var(--secondary-text-color)"
            />
            <TooltipAprItem
              apr={votingAprDisplayed}
              aprOpacity={isVotingPresent ? 1 : 0.5}
              displayValueFormatter={usedDisplayValueFormatter}
              title="Voting incentives (average)"
              tooltipText={votingIncentivesTooltipText}
              valueFontColor="var(--secondary-text-color)"
            />
            <Divider style={{ margin: 0 }} />
            <TooltipAprItem
              {...{
                paddingLeft: '2px',
                paddingTop: '6px',
                paddingRight: '4px',
              }}
              apr={totalCombinedDisplayed}
              displayValueFormatter={usedDisplayValueFormatter}
              title={totalVeBalTitle ?? 'Total APR'}
              fontWeight={600}
            />
          </div>
        </>
      ) : null}
      {hasVeBalBoost ? (
        <>
          <Divider style={{ margin: 0 }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              borderRadius: '4px',
            }}
          >
            <TooltipAprItem
              {...{ paddingTop: '6px' }}
              apr={extraBalAprDisplayed}
              displayValueFormatter={usedDisplayValueFormatter}
              fontColor={isDark ? 'var(--gray-400)' : 'var(--gray-600)'}
              fontWeight={500}
              title="Extra BAL (veBAL boost)"
              tooltipText={extraBalTooltipText}
              valueFontColor="var(--secondary-text-color)"
            />
            <Divider style={{ margin: 0 }} />
            <TooltipAprItem
              {...{
                paddingLeft: '4px',
                paddingTop: '6px',
              }}
              apr={maxVeBalDisplayed}
              boxBackground={balRewardGradient}
              displayValueFormatter={usedDisplayValueFormatter}
              title={maxVeBalText || 'Max veBAL APR'}
              fontWeight={600}
              fontColor={'var(--secondary-color)'}
              tooltipText={
                shouldDisplayMaxVeBalTooltip
                  ? `${defaultDisplayValueFormatter(
                      defaultNumberFormatter(maxVeBal.toString())
                    )} APR`
                  : ''
              }
            />
          </div>
        </>
      ) : null}
      {isMaBeetsPresent && (
        <>
          <Divider style={{ margin: 0 }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            <TooltipAprItem
              {...{
                paddingLeft: '12px',
                paddingTop: '6px',
              }}
              apr={maxMaBeetsRewardDisplayed}
              displayValueFormatter={usedDisplayValueFormatter}
              fontColor={isDark ? 'var(--gray-400)' : 'var(--gray-600)'}
              fontWeight={500}
              title="Extra BEETS (max maturity boost)"
              tooltipText={maBeetsRewardTooltipText}
            />
            <TooltipAprItem
              {...{
                paddingLeft: '12px',
              }}
              apr={maxMaBeetsVotingRewardDisplayed}
              displayValueFormatter={usedDisplayValueFormatter}
              fontColor={isDark ? 'var(--gray-400)' : 'var(--gray-600)'}
              fontWeight={500}
              title="Extra Voting APR"
              tooltipText={maBeetsVotingRewardsTooltipText}
            />
            <Divider style={{ margin: 0 }} />
            <TooltipAprItem
              {...{
                paddingLeft: '2px',
                paddingTop: '6px',
              }}
              apr={maBeetsTotalAprDisplayed}
              boxBackground={balRewardGradient}
              displayValueFormatter={usedDisplayValueFormatter}
              title="Max total APR"
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <Popover
      placement={placement}
      trigger="hover"
      open={isOpen}
      onOpenChange={setOpen}
      content={popoverContent}
      style={{ padding: 0 }}
    >
      {typeof children === 'function' ? children({ isOpen }) : children}
    </Popover>
  );
};

export type { Props as BaseAprTooltipProps };
