import { insertAccountSchema } from '@/db/schema';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4 p-4'
      >
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder='e.g. Cash, Bank, Credit Card '
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className='w-full' disabled={disabled}>
          {id ? 'Save Changes' : 'Create Account'}
        </Button>
        {!!id && (
          <Button
            type='button'
            className='w-full'
            variant='outline'
            onClick={handleDelete}
            disabled={disabled}
          >
            <Trash className='size-4 mr-2  ' />
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
};
