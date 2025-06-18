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
        <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:brightness-110 px-5 py-2 rounded-md text-sm font-medium shadow">
          {defaultValues ? "Update Habit" : "Create Habit"}
        </Button>
      </form>
    </Form>
  );
};
