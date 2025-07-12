'use client';

import EditAccountSheet from '@/features/accounts/components/edit-account-sheet';
import NewAccountSheet from '@/features/accounts/components/new-account-sheet';
// import { useMountedState } from 'react-use';
export const SheetProvider = () => {
  // const ismounted = useMountedState();
  // if (!ismounted()) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};
