import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/Redux/Auth/Action';

const Login = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((store) => store.auth);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  const getErrorMessage = () => {
    if (!error) return null;

    // Check status code directly if error contains response metadata
    const status = error?.status || error?.response?.status;
    if (status >= 400 && status <= 403) {
      return 'Email or password is wrong';
    }

    // Convert string error representations and check for standard 400-403 indicators
    const msg = typeof error === 'string' ? error : error?.message || '';

    const isClientAuthError =
      msg.includes('400') ||
      msg.includes('401') ||
      msg.includes('402') ||
      msg.includes('403') ||
      /bad credentials|unauthorized|forbidden|invalid/i.test(msg);

    if (isClientAuthError) {
      return 'Email or password is wrong';
    }

    return msg || 'Email or password is wrong';
  };

  const displayError = getErrorMessage();

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-center text-gray-900">Sign In</h1>

      {/* Error alert box */}
      {displayError && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md text-center font-medium">
          {displayError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Password"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;