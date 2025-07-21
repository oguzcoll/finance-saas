import { format } from 'date-fns';
import {
  Tooltip,
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

import { CustomTooltip } from './custom-tooltip';

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey='date'
          tickFormatter={(value) => format(value, 'dd MMM')}
          tickMargin={16}
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey='income' fill='#3d82f6' className='drop-shadow-sm' />
        <Bar dataKey='expenses' fill='#f43f5e' className='drop-shadow-sm' />
      </BarChart>
    </ResponsiveContainer>
  );
};
