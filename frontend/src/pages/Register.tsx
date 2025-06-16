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
        <CardHeader className="pb-4">
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
                        placeholder="e.g. marioma99"
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
                className="w-full h-9 mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
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