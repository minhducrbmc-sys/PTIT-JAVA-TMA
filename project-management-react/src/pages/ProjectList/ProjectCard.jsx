import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DotFilledIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import { useDispatch } from 'react-redux'
import { deleteProject } from '@/Redux/Project/Action'

const ProjectCard = ({ item }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteProject({ projectId: item?.id }))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return {
          dotColor: 'bg-emerald-500',
          label: 'Completed',
          badgeClass: 'border-emerald-200 text-emerald-700 bg-emerald-50/50',
        }
      case 'on_hold':
        return {
          dotColor: 'bg-rose-500',
          label: 'On Hold',
          badgeClass: 'border-rose-200 text-rose-700 bg-rose-50/50',
        }
      case 'in_progress':
      default:
        return {
          dotColor: 'bg-amber-400',
          label: 'In Progress',
          badgeClass: 'border-amber-200 text-amber-700 bg-amber-50/50',
        }
    }
  }

  const currentStatus = getStatusBadge(item?.status)

  return (
    <Card className="p-5 w-full lg:max-w-3xl">
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                onClick={() => navigate(`/project/${item?.id}`)}
                className="cursor-pointer font-bold text-lg hover:text-primary transition-colors text-black"
              >
                {item?.name}
              </h1>
              <DotFilledIcon className="text-gray-400" />
              <p className="text-sm text-gray-400 capitalize">{item?.category}</p>
              
              {/* Status Indicator */}
              <Badge variant="outline" className={`ml-2 flex items-center gap-1.5 py-0.5 px-2 text-xs font-medium ${currentStatus.badgeClass}`}>
                <span className={`h-2 w-2 rounded-full ${currentStatus.dotColor}`} />
                {currentStatus.label}
              </Badge>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-full" variant="ghost" size="icon">
                    <DotsVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate(`/project/${item?.id}`)}>
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="text-gray-500 text-sm">{item?.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {item?.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default ProjectCard