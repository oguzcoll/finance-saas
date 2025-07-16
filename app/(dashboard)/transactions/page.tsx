'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import React from 'react';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete-accounts';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';

const TransactionsPage = () => {
  const newTransaction = useNewTransaction();
  const accountsQuery = useGetAccounts();
  const deleteAccounts = useBulkDeleteAccounts();
  const accounts = accountsQuery.data || [];

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

  if (accountsQuery.isLoading) {
    return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24 '>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader>
            <Skeleton className='h-8 w-48' />
          </CardHeader>
          <CardContent>
            <div className='h-[500px] w-full flex items-center justify-center'>
              <Loader2 className='size-6 text-slate-300 animate-spin' />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24 '>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 flex flex-col md:flex-row md:items-center md:justify-between '>
          <CardTitle className='text-xl line-clamp-1'>
            Transaction History
          </CardTitle>
          <Button size='sm' onClick={newTransaction.onOpen}>
            <Plus className='mr-2 size-4' />
            Add Neww
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            disabled={isDisabled}
            columns={columns}
            data={accounts}
            filterKey='name'
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
