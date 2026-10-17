import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Cross1Icon } from '@radix-ui/react-icons'
import { useDispatch } from 'react-redux'
import { createProject } from '@/Redux/Project/Action'

export const tags = [
  'All',
  'React',
  'Next.js',
  'Spring Boot',
  'MySQL',
  'MongoDB',
  'Angular',
  'Python',
  'Flask',
  'Django',
  'Simple Java',
]

const CreateProjectForm = ({ onClose }) => {
  const dispatch = useDispatch()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: 'full stack',
      tags: [],
    },
  })

  const handleTagsChange = (tag) => {
    const currentTags = form.getValues('tags') || []
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]
    form.setValue('tags', updatedTags)
  }

  const onSubmit = (data) => {
    dispatch(createProject(data))
    console.log('Created project data:', data)
    if (onClose) {
      onClose()
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    defaultValue="fullstack"
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullstack">Full Stack</SelectItem>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={(value) => handleTagsChange(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className="flex gap-1 flex-wrap">
                  {field.value?.map((item) => (
                    <div
                      key={item}
                      onClick={() => handleTagsChange(item)}
                      className="cursor-pointer flex rounded-full items-center border gap-2 px-4 py-1"
                    >
                      <span className="text-sm">{item}</span>
                      <Cross1Icon className="h-3 w-3" />
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-5">
            Create Project
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateProjectForm