import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createIssue } from '@/Redux/Issue/Action'

const CreateIssueForm = ({ status, setOpen }) => {
  const dispatch = useDispatch()
  const { id: projectId } = useParams()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePriorityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      priority: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const issueData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: status || 'pending',
      projectId: Number(projectId),
      dueDate: formData.dueDate ? formData.dueDate : null, // format: "YYYY-MM-DD"
    }

    dispatch(createIssue(issueData))
    setOpen(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <label className="text-xs font-semibold text-gray-700">Task Title</label>
        <Input
          name="title"
          placeholder="Issue title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700">Description</label>
        <Textarea
          name="description"
          placeholder="Detailed description..."
          value={formData.description}
          onChange={handleChange}
          className="mt-1 resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-700">Priority</label>
          <Select value={formData.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700">Due Date</label>
          <Input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="mt-1 cursor-pointer"
          />
        </div>
      </div>

      <Button type="submit" className="w-full mt-2">
        Create Task
      </Button>
    </form>
  )
}

export default CreateIssueForm