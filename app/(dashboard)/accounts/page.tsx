'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { Plus } from 'lucide-react';
import React from 'react';
import { columns, Payment } from './columns';
import { DataTable } from '@/components/data-table';

const data: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: 'b2f8c3a1',
    amount: 200,
    status: 'success',
    email: 'aq@gmail.com',
  },
  // ...
];
const AccountsPage = () => {
  const newAccount = useNewAccount();
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24 '>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 flex flex-col md:flex-row md:items-center md:justify-between '>
          <CardTitle className='text-xl line-clamp-1'>Accounts Page</CardTitle>
          <Button size='sm' onClick={newAccount.onOpen}>
            <Plus className='mr-2 size-4' />
            Add Neww
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            filterKey='email'
            onDelete={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
