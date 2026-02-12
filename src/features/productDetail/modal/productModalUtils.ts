export const isProductModalActionDisabled = (
  understandExternalWebsite: boolean,
  acceptedTerms: boolean
) => !understandExternalWebsite || !acceptedTerms;

export const buildProductModalAuditLogRequest = ({
  isWithdraw,
  understandExternalWebsite,
  visitorId,
}: {
  isWithdraw: boolean;
  understandExternalWebsite: boolean;
  visitorId?: string;
}) => ({
  timestamp: new Date().toLocaleString(undefined, {
    timeZoneName: 'long',
  }),
  user: visitorId ?? 'unknown',
  page: isWithdraw
    ? 'productDetail-withdraw-redirect'
    : 'productDetail-deposit-redirect',
  tosAgreement: understandExternalWebsite ? 'accepted' : 'not accepted',
});
