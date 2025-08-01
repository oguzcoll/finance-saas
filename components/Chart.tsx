'use client';
import { AreaChart, BarChart3, FileSearch, LineChart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AreaVariant } from './are-variant';
import { BarVariant } from './bar-variant';
import { LineVariant } from './line-variant';
import { useState } from 'react';

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};
export const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState('area');
  const ontypeChange = (type: string) => {
    setChartType(type);
  };
  return (
    <Card className='border-none drop-shadow-sm'>
      <CardHeader className='flex space-y-2 lg:space-y0 lg:flex-row lg:items-center justify-between'>
        <CardTitle className='line-clamp-1 text-xl'>Transactions</CardTitle>
        <Select onValueChange={ontypeChange} defaultValue={chartType}>
          <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
            <SelectValue placeholder='Chart type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='area'>
              <div className='flex items-center '>
                <AreaChart className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>Area Chart</p>
              </div>
            </SelectItem>
            <SelectItem value='line'>
              <div className='flex items-center '>
                <LineChart className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>Line Chart</p>
              </div>
            </SelectItem>
            <SelectItem value='bar'>
              <div className='flex items-center '>
                <BarChart3 className='size-4 mr-2 shrink-0' />
                <p className='line-clamp-1'>Bar Chart</p>
              </div>
            </SelectItem>{' '}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className='flex flex-col gap-y-4 items-center justify-center h-[350px] w-full'>
            <FileSearch className='size-6 text-muted-foreground' />
            <p className='text-muted-foreground text-sm'>
              No data for this period
            </p>
          </div>
        ) : (
          <>
            {chartType === 'area' && <AreaVariant data={data} />}
            {chartType === 'bar' && <BarVariant data={data} />}
            {chartType === 'line' && <LineVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};
