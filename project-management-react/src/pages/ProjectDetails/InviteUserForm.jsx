import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { inviteToProject } from '@/Redux/Project/Action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

const InviteUserForm = ({ projectId }) => {
  const dispatch = useDispatch()
  const form = useForm({
    defaultValues: { email: '' },
  })

  const onSubmit = (data) => {
    dispatch(inviteToProject({ email: data.email, projectId }))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Enter user email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Invite User
        </Button>
      </form>
    </Form>
  )
}

export default InviteUserForm