import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createComment } from '@/Redux/Comment/Action'

const CreateCommentForm = ({ issueId }) => {
  const dispatch = useDispatch()
  const { auth } = useSelector((store) => store)

  const form = useForm({
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = (data) => {
    dispatch(createComment({ content: data.content, issueId }))
    form.reset()
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <div>
                    <Avatar>
                      <AvatarFallback>
                        {auth.user?.fullName ? auth.user.fullName[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="w-[20rem] border"
                      placeholder="add comment here..."
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Send</Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateCommentForm