import { FC } from 'react';

import { AppPublicLayout } from '../layouts/public-layout';

export const PublicRoute: FC = ({ children }) => {
  return <AppPublicLayout>{children}</AppPublicLayout>;
};
