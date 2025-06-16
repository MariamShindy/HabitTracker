import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema } from "../lib/schemas";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type HabitFormProps = {
  onSubmit: (data: any) => void;
};

export const HabitForm = ({ onSubmit }: HabitFormProps) => {
  const form = useForm<z.infer<typeof habitSchema>>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Habit Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Drink Water"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                             focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                             dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Habit
        </Button>
      </form>
    </Form>
  );
};
