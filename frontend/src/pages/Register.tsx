import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema } from '../lib/schemas';
import { registerUser } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Register = () => {
  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: { username: string; email: string; password: string }) => {
    try {
      console.log('Registering with data:', data);
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-[600px] max-w-md shadow-md border border-gray-200 rounded-lg">
        <CardHeader className="pb-4 flex flex-col items-center">
          <img
            src="/imgs/habit.png"
            alt="Habit logo"
            className="w-20 h-20 rounded-full mb-2 object-cover"
          />
          <h2 className="text-2xl font-semibold text-center text-gray-800">Create Account</h2>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 space-y-3">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. mariam99"
                        className="h-9 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 space-y-3">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="h-9 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 space-y-3">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="**************"
                        className="h-9 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm"
              >
                Register
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};