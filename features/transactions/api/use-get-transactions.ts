import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const accountId = params.get('accountId') || '';

  const query = useQuery({
    // TODO CHECK IF PARAMS ARE NEEDED IN THE KEY
    queryKey: ['transactions', { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Transactions');
      }
      const { data } = await response.json();

      return data.map((transaction) => ({
        ...transaction,
        amount: convertAmountFromMiliunits(transaction.amount),
      }));
    },
  });

  return query;
};
