import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { assignedUserToIssue, fetchIssues } from '@/Redux/Issue/Action'

const UserList = ({ issueDetails, projectId }) => {
  const dispatch = useDispatch()
  const { projectDetails } = useSelector((store) => store.project)

  // Check assignment against both assignee and assigned properties
  const assignedUserId =
    issueDetails?.assignee?.id || issueDetails?.assigned?.id

  const handleAssignUser = async (userId) => {
    if (!issueDetails?.id || !userId) return

    await dispatch(
      assignedUserToIssue({
        issueId: issueDetails.id,
        userId: userId,
      })
    )

    if (projectId) {
      dispatch(fetchIssues(projectId))
    }
  }

  return (
    <div className="space-y-1 p-1 min-w-[15rem]">
      <p className="text-xs font-semibold px-2 py-1.5 text-gray-700 border-b">
        Task assigned to
      </p>

      {projectDetails?.team && projectDetails.team.length > 0 ? (
        projectDetails.team.map((user) => {
          const isAssigned = assignedUserId === user.id

          return (
            <DropdownMenuItem
              key={user.id}
              onClick={() => handleAssignUser(user.id)}
              className={`flex items-center gap-3 p-2 cursor-pointer rounded-md transition-colors
                hover:bg-slate-100 focus:bg-slate-100 text-gray-900
                ${isAssigned ? 'bg-slate-50 font-medium' : ''}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-slate-200 text-slate-800 font-semibold">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-left leading-tight flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-900">
                    {user.fullName}
                  </span>
                  {isAssigned && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1 py-0.2 rounded">
                      (ASSIGNED)
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400">{user.email}</span>
              </div>
            </DropdownMenuItem>
          )
        })
      ) : (
        <p className="text-xs text-gray-400 p-2">No team members</p>
      )}
    </div>
  )
}

export default UserList