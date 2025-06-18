import { useEffect } from "react";
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
  onSubmit: (data: { name: string }) => void;
  defaultValues?: { name: string };
};

export const HabitForm = ({ onSubmit, defaultValues }: HabitFormProps) => {
  const form = useForm<z.infer<typeof habitSchema>>({
    resolver: zodResolver(habitSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Drink Water" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            className="cursor-pointer text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2 shadow"
          >
            {defaultValues ? "Update Habit" : "Create Habit"}
          </Button>
        </div>

      </form>
    </Form>
  );
};
