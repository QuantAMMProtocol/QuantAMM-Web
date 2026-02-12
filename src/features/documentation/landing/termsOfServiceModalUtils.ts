export type LocationChoice = '' | 'uk' | 'nonUk';

export const isContinueEnabledForLocation = (location: LocationChoice) =>
  location === 'nonUk';

export const shouldRedirectToIneligible = (
  location: LocationChoice,
  continueEnabled: boolean
) => !continueEnabled || location === 'uk';

export const buildTosAuditLogRequest = ({
  hostname,
  page,
  isMobile,
}: {
  hostname: string;
  page: string;
  isMobile: boolean;
}) => ({
  timestamp: new Date().toLocaleString(undefined, {
    timeZoneName: 'long',
  }),
  user: hostname,
  page: `${page}-tos-gate`,
  isMobile,
  tosAgreement: 'accepted',
});
