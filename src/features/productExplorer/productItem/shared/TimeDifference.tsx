import { ReactNode } from 'react';

export const getTimeDifference = (createTime: string): ReactNode => {
  const createdDate = new Date(createTime);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;

  return (
    <>
      {years > 0 && `${years}y `}
      {months > 0 && `${months}m `}
      {years == 0 && days > 0 && `${days}d`}
    </>
  );
};
