import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, Cross2Icon } from '@radix-ui/react-icons'
import IssueList from './IssueList'
import ChatBox from './ChatBox'
import InviteUserForm from './InviteUserForm'
import { fetchProjectById, updateProject, removeUserFromProject } from '@/Redux/Project/Action'

const ProjectDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projectDetails } = useSelector((store) => store.project)
  const { user } = useSelector((store) => store.auth)
  const { id } = useParams()

  const [projectStatus, setProjectStatus] = useState('in_progress')

  useEffect(() => {
    if (id && id !== 'undefined') {
      dispatch(fetchProjectById(id))
    }
  }, [id, dispatch])

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

  // Sync state whenever projectDetails is loaded from Redux
  useEffect(() => {
    if (projectDetails?.status) {
      setProjectStatus(projectDetails.status)
    }
  }, [projectDetails])

  const handleStatusChange = async (newStatus) => {
    setProjectStatus(newStatus)
    try {
      await dispatch(
        updateProject({
          projectId: id,
          projectData: {
            ...projectDetails,
            status: newStatus,
          },
        })
      )
      window.location.reload()
    } catch (error) {
      console.error('Failed to update project status:', error)
    }
  }

  const isLead = Boolean(user?.id) && (user?.id === projectDetails?.owner?.id || user?.id === projectDetails?.lead?.id)

  const handleRemoveMember = (userId) => {
    dispatch(removeUserFromProject({ projectId: id, userId }))
  }

  return (
    <div className="mt-5 lg:px-10">
      <div className="lg:flex gap-5 justify-between pb-4">
        {/* Left Scrollable Details Section with horizontal breathing room */}
        <ScrollArea className="h-screen lg:w-[69%] px-3">
          <div className="pb-10">
            {/* Project Title */}
            <h1 className="text-2xl font-bold pb-5 text-black">
              {projectDetails?.name || 'Loading project...'}
            </h1>

            <div className="space-y-5 pb-10 text-sm">
              <p className="text-gray-600 leading-relaxed">
                {projectDetails?.description || 'No description provided.'}
              </p>

              {/* Project Lead */}
              <div className="flex items-center">
                <p className="w-36 font-semibold text-black">Project Lead :</p>
                <p className="text-gray-800 font-medium">
                  {projectDetails?.owner?.fullName || 'N/A'}
                </p>
              </div>

              {/* Members */}
              <div className="flex items-center">
                <p className="w-36 font-semibold text-black">Members :</p>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    {projectDetails?.team && projectDetails.team.length > 0 ? (
                      projectDetails.team.map((member) => (
                        <div key={member.id} className="relative group">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="cursor-pointer">
                                <AvatarFallback className="bg-slate-200 text-slate-800 font-medium">
                                  {member.fullName ? member.fullName[0].toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-100 text-slate-800 border border-slate-200">
                              <p className="font-semibold text-slate-900">{member.fullName}</p>
                              {member.email && (
                                <p className="text-xs text-slate-500">{member.email}</p>
                              )}
                            </TooltipContent>
                          </Tooltip>

                          {/* Show remove button only to project lead, excluding the owner themselves */}
                          {isLead && member.id !== projectDetails?.owner?.id && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.id)}
                              className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              title="Remove member"
                            >
                              <Cross2Icon className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="cursor-pointer">
                            <AvatarFallback className="bg-slate-200 text-slate-800 font-medium">
                              {projectDetails?.owner?.fullName?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-100 text-slate-800 border border-slate-200">
                          <p className="font-semibold">
                            {projectDetails?.owner?.fullName || 'Project Lead'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="ml-2">
                        <span>Invite</span>
                        <PlusIcon className="w-3 h-3 ml-1" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite User</DialogTitle>
                      </DialogHeader>
                      <InviteUserForm projectId={id} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center">
                <p className="w-36 font-semibold text-black">Category :</p>
                <Badge variant="secondary" className="capitalize text-xs font-semibold">
                  {projectDetails?.category || 'General'}
                </Badge>
              </div>

              {/* Status Selector */}
              <div className="flex items-center">
                <p className="w-36 font-semibold text-black">Status :</p>
                <Select value={projectStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[150px] h-8 text-xs font-semibold">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tasks / Issue Columns (Grid prevents overflowing & edge cutoff) */}
            <section className="w-full">
              <p className="py-5 font-bold text-lg tracking-wider text-black">
                Tasks
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                <IssueList status="pending" title="Todo List" projectId={id} />
                <IssueList status="in_progress" title="In Progress" projectId={id} />
                <IssueList status="done" title="Done" projectId={id} />
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Chat Section */}
        <div className="lg:w-[30%] rounded-md sticky right-5 top-10">
          <ChatBox projectId={id} />
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails