'use client';
import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { formatDateRange } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { FaPiggyBank } from 'react-icons/fa';
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6';
import { DataCard, DataCardLoading } from './data-card';
export const DataGrid = () => {
  const { data, isLoading } = useGetSummary();
  const params = useSearchParams();
  const from = params.get('from') || undefined;
  const to = params.get('to') || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  if (isLoading) {
    return (
      <div className='grid grid-cols1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className='grid grid-cols1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
      <DataCard
        title='Remaining'
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant='default'
        dateRange={dateRangeLabel}
      />
      <DataCard
        title='Income'
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant='default'
        dateRange={dateRangeLabel}
      />
      <DataCard
        title='Expenses'
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        variant='default'
        dateRange={dateRangeLabel}
      />
    </div>
  );
};
