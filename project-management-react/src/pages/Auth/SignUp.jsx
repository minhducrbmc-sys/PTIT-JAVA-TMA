import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { register, sendOtp } from '@/Redux/Auth/Action';

const Signup = () => {
  const dispatch = useDispatch();
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');

  const form = useForm({
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      otp: '',
    },
  });

  const handleSendOtp = async () => {
    // Triggers the exact same validation rules as the register submit
    const isValidEmail = await form.trigger('email');
    if (!isValidEmail) return;

    const email = form.getValues('email');

    setIsSendingOtp(true);
    setOtpNotice('');

    const response = await dispatch(sendOtp(email));
    setIsSendingOtp(false);

    if (response?.success) {
      setOtpNotice('OTP sent to your email!');
    } else {
      setOtpNotice(response?.message || 'Failed to send OTP');
    }
  };

  const onSubmit = (data) => {
    dispatch(register(data));
    console.log('Signup Data:', data);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-center text-gray-900">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* 1. Enter email */}
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
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

          {/* 2. Receive OTP button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleSendOtp}
            disabled={isSendingOtp}
            className="w-full text-xs font-semibold py-2"
          >
            {isSendingOtp ? 'Sending OTP...' : 'Receive OTP'}
          </Button>
          {otpNotice && (
            <p className="text-xs text-center text-slate-600 italic">
              {otpNotice}
            </p>
          )}

          {/* 3. Username */}
          <FormField
            control={form.control}
            name="fullName"
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Username"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 4. Password */}
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
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

          {/* 5. Enter received OTP here */}
          <FormField
            control={form.control}
            name="otp"
            rules={{ required: 'OTP is required' }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter OTP"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 6. Create account */}
          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Signup;