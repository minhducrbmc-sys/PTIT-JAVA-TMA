import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PersonIcon, LockClosedIcon } from '@radix-ui/react-icons'
import CreateCommentForm from './CreateCommentForm'
import CommentCard from './CommentCard'
import SubmitFileBox from './SubmitFileBox'
import { fetchIssueById, updateIssueStatus } from '@/Redux/Issue/Action'
import { fetchComments } from '@/Redux/Comment/Action'
import { fetchProjectById } from '@/Redux/Project/Action'

const IssueDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projectId, issueId } = useParams()

  const { issueDetails } = useSelector((store) => store.issue)
  const { projectDetails } = useSelector((store) => store.project)
  const { comments } = useSelector((store) => store.comment)
  const { user } = useSelector((store) => store.auth)

  useEffect(() => {
    if (issueId) {
      dispatch(fetchIssueById(issueId))
      dispatch(fetchComments(issueId))
    }
  }, [issueId, dispatch])

  useEffect(() => {
    const idToFetch = projectId || issueDetails?.projectId
    if (idToFetch) {
      dispatch(fetchProjectById(idToFetch))
    }
  }, [projectId, issueDetails?.projectId, dispatch])

  // Redirect user to the front page if they are not part of the team
  useEffect(() => {
    if (user && projectDetails?.team) {
      const isMember = projectDetails.team.some(
        (member) => member.id === user.id
      )
      if (!isMember) {
        navigate('/')
      }
    }
  }, [user, projectDetails, navigate])

  const handleUpdateIssueStatus = (status) => {
    dispatch(updateIssueStatus({ id: issueId, status }))
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? dateString.split('T')[0]
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
  }

  const taskCreator = issueDetails?.creator
  const assignedMember = issueDetails?.assignee || issueDetails?.assigned

  // Permission: Status change restricted to project owner or task creator
  const isProjectOwner =
    Boolean(user?.id) &&
    (projectDetails?.owner?.id === user?.id || projectDetails?.lead?.id === user?.id)

  const isTaskIssuer =
    Boolean(user?.id) && taskCreator?.id === user?.id

  const canChangeStatus = isProjectOwner || isTaskIssuer

  // Permission: Submission box shown only to the assigned member
  const isAssignee =
    Boolean(user?.id) &&
    (assignedMember?.id === user?.id)

  return (
    <div className="px-10 lg:px-20 py-8 text-gray-800">
      <div className="flex flex-col lg:flex-row justify-between gap-8 border p-8 rounded-lg bg-white shadow-sm">
        {/* Left Section */}
        <ScrollArea className="h-[80vh] lg:w-[65%] pr-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {issueDetails?.title || 'Loading title...'}
            </h1>

            <div className="py-5">
              <h2 className="font-semibold text-gray-700 text-sm">Description</h2>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {issueDetails?.description || 'No description provided.'}
              </p>
            </div>

            {/* Comments Section */}
            <div className="mt-6 border-t pt-4">
              <h2 className="pb-3 text-gray-800 font-semibold text-sm">Comments</h2>
              <CreateCommentForm issueId={issueId} />
              <div className="space-y-4 pt-4">
                {comments && comments.length > 0 ? (
                  comments.map((item) => (
                    <CommentCard key={item.id} item={item} />
                  ))
                ) : (
                  <p className="text-xs text-gray-400 py-4">No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Right Section */}
        <div className="lg:w-[32%] space-y-4">
          {/* Status Selector + Inline Assigned Member Badge */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <Select
                value={issueDetails?.status || 'pending'}
                onValueChange={handleUpdateIssueStatus}
                disabled={!canChangeStatus}
              >
                <SelectTrigger
                  className={`w-[170px] ${
                    !canChangeStatus ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''
                  }`}
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>

              {/* Header Assigned Member Box */}
              <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 bg-slate-50">
                <Avatar className="h-6 w-6 text-xs">
                  <AvatarFallback className="bg-slate-200 text-slate-800 font-semibold text-[11px]">
                    {assignedMember?.fullName ? (
                      assignedMember.fullName[0].toUpperCase()
                    ) : (
                      <PersonIcon className="h-3 w-3 text-gray-500" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs">
                  <p className="text-[10px] text-gray-400 leading-none">Assigned</p>
                  <p className="font-medium text-gray-800 truncate max-w-[90px]">
                    {assignedMember?.fullName || 'Unassigned'}
                  </p>
                </div>
              </div>
            </div>

            {!canChangeStatus && (
              <p className="text-[11px] text-amber-600 flex items-center gap-1 pt-1">
                <LockClosedIcon className="h-3 w-3" /> Only owner or task issuer can change status
              </p>
            )}
          </div>

          {/* File Submission Box (Rendered exclusively for the assigned team member) */}
          {isAssignee && (
            <SubmitFileBox
              issueId={issueId}
              creatorEmail={taskCreator?.email}
              creatorName={taskCreator?.fullName}
            />
          )}

          {/* Details Table */}
          <div className="border rounded-lg p-5">
            <p className="border-b pb-3 font-semibold text-gray-900 text-sm">Details</p>

            <div className="pt-4 space-y-5 text-sm">
              {/* Task Issuer (Creator) */}
              <div className="flex gap-6 items-center">
                <p className="w-24 text-gray-500 font-medium text-xs">Task Issuer</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7 text-xs">
                    <AvatarFallback className="bg-slate-200 text-slate-800 font-semibold">
                      {taskCreator?.fullName ? (
                        taskCreator.fullName[0].toUpperCase()
                      ) : (
                        '?'
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-medium text-xs">
                      {taskCreator?.fullName || 'Project Lead'}
                    </p>
                    {taskCreator?.email && (
                      <p className="text-[11px] text-gray-400">
                        {taskCreator.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Assigned Member */}
              <div className="flex gap-6 items-center">
                <p className="w-24 text-gray-500 font-medium text-xs">Assigned To</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7 text-xs">
                    <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                      {assignedMember?.fullName ? (
                        assignedMember.fullName[0].toUpperCase()
                      ) : (
                        <PersonIcon className="h-3.5 w-3.5 text-gray-500" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-800 font-medium text-xs">
                      {assignedMember?.fullName || 'Unassigned'}
                    </p>
                    {assignedMember?.email && (
                      <p className="text-[11px] text-gray-400">
                        {assignedMember.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-6 items-center">
                <p className="w-24 text-gray-500 font-medium text-xs">Status</p>
                <Badge variant="outline" className="capitalize text-xs">
                  {issueDetails?.status?.replace('_', ' ') || 'Pending'}
                </Badge>
              </div>

              {/* Priority */}
              <div className="flex gap-6 items-center">
                <p className="w-24 text-gray-500 font-medium text-xs">Priority</p>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize font-medium ${getPriorityBadgeClass(
                    issueDetails?.priority
                  )}`}
                >
                  {issueDetails?.priority || 'Medium'}
                </Badge>
              </div>

              {/* Due Date */}
              <div className="flex gap-6 items-center">
                <p className="w-24 text-gray-500 font-medium text-xs">Due Date</p>
                <p className="text-gray-800 font-medium text-xs">
                  {formatDate(issueDetails?.dueDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueDetails