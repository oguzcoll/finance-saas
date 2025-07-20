import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const accountId = params.get('accountId') || '';

  const query = useQuery({
    // TODO CHECK IF PARAMS ARE NEEDED IN THE KEY
    queryKey: ['summary', { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Summary');
      }
      const { data } = await response.json();
      return {
        ...data,
        income: convertAmountFromMiliunits(data.incomeAmount),
        expenses: convertAmountFromMiliunits(data.expensesAmount),
        remaining: convertAmountFromMiliunits(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMiliunits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses),
        })),
      };
    },
  });

  return query;
};
