/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  RadialBar,
  Legend,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';

import { formatCurrency } from '@/lib/utils';
const COLORS = ['#0062FF', '#12C6FF', '#FF647F', '#FF9354'];

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export const RadialVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <RadialBarChart
        data={data.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }))}
        cx='50%'
        cy='50%'
        innerRadius='90%'
        outerRadius='40%'
      >
        <RadialBar
          label={{ position: 'insideStart', fill: '#fff', fontSize: '12px' }}
          dataKey='value'
          background
        />

        <Legend
          layout='horizontal'
          verticalAlign='bottom'
          align='right'
          iconType='circle'
          content={({ payload }: any) => {
            return (
              <ul className='flex flex-col space-y-2'>
                {payload.map((entry: any, index: number) => (
                  <li
                    key={`item-${index}`}
                    className='flex items-center space-x-2'
                  >
                    <span
                      className='size-2 rounded-full'
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className='space-x-1'>
                      <span className='text-sm text-muted-foreground '>
                        {entry.value}
                      </span>
                      <span className='text-sm'>
                        {formatCurrency(entry.payload.value)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
