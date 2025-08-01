/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ImportTable from './import-table';
import { convertAmountToMiliunits } from '@/lib/utils';
import { format, parse } from 'date-fns';

const dateFormat = 'yyyy-MM-dd HH:mm:ss';
const outputFormat = 'yyyy-MM-dd';

const requiredOptions = ['amount', 'date', 'payee'];

interface SelectedColumnState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};
const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>(
    {}
  );
  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      console.log('prev:', prev);
      const newSelectedColumns = { ...prev };
      console.log('newSelectedColumns:', newSelectedColumns);

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null; // Clear the previous selection
        }
      }
      if (value === 'skip') {
        value = null; // Treat "Skip" as null
      }
      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split('_')[1];
    };
    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}s`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}s`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });
          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };
    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat),
    }));
    onSubmit(formattedData);
  };
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24 '>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 flex flex-col md:flex-row md:items-center md:justify-between '>
          <CardTitle className='text-xl line-clamp-1'>
            Import Transaction
          </CardTitle>
          <div className='flex flex-col lg:flex-row gap-y-2 items-center gap-x-2'>
            <Button size='sm' onClick={onCancel} className='w-full lg:w-auto'>
              Cancel
            </Button>
            <Button
              size='sm'
              onClick={handleContinue}
              disabled={progress < requiredOptions.length}
              className='w-full lg:w-auto'
            >
              Continue ({progress}/{requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportCard;
