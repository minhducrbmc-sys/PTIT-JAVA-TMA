import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DotsVerticalIcon, PersonIcon } from '@radix-ui/react-icons'
import UserList from './UserList'
import { deleteIssue, updateIssueStatus, fetchIssues } from '@/Redux/Issue/Action'

const IssueCard = ({ item, projectId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleIssueDelete = () => {
    dispatch(deleteIssue(item.id))
  }

  const handleStatusChange = async (status) => {
    await dispatch(updateIssueStatus({ id: item.id, status }))
    if (projectId) {
      dispatch(fetchIssues(projectId))
    }
  }

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'border-red-200 text-red-700 bg-red-50'
      case 'high':
        return 'border-amber-200 text-amber-700 bg-amber-50'
      case 'low':
        return 'border-blue-200 text-blue-700 bg-blue-50'
      case 'medium':
      default:
        return 'border-slate-200 text-slate-700 bg-slate-50'
    }
  }

  // Uses the initial of the assigned user (checks assignee then assigned)
  const assignedUser = item.assignee || item.assigned
  const assigneeInitial = assignedUser?.fullName
    ? assignedUser.fullName[0].toUpperCase()
    : null

  return (
    <Card className="rounded-md py-2 px-3 shadow-xs">
      <CardHeader className="p-0 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle
              onClick={() => navigate(`/project/${projectId}/issue/${item.id}`)}
              className="cursor-pointer text-sm hover:underline font-semibold"
            >
              {item.title}
            </CardTitle>

            <Badge
              variant="outline"
              className={`text-[10px] py-0 px-1.5 capitalize font-medium ${getPriorityBadgeClass(
                item.priority
              )}`}
            >
              {item.priority || 'Medium'}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full h-7 w-7">
                <DotsVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('done')}>
                Done
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/project/${projectId}/issue/${item.id}`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleIssueDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex items-center justify-between text-xs text-gray-500">
        <p>FBP - {item.id}</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full h-7 w-7 p-0 focus-visible:ring-0"
            >
              <Avatar className="h-7 w-7 cursor-pointer">
                <AvatarFallback className="text-xs bg-slate-200 text-slate-800 font-semibold">
                  {assigneeInitial ? (
                    assigneeInitial
                  ) : (
                    <PersonIcon className="h-3.5 w-3.5 text-gray-500" />
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <UserList issueDetails={item} projectId={projectId} />
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}

export default IssueCard