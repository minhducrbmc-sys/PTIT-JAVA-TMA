import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TrashIcon } from '@radix-ui/react-icons'
import { deleteComment } from '@/Redux/Comment/Action'

const CommentCard = ({ item }) => {
  const dispatch = useDispatch()
  const user = useSelector((store) => store.auth?.user)

  const handleDelete = () => {
    dispatch(deleteComment(item.id))
  }

const formatCommentDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
}

  const canDelete =
    user?.id === item.user?.id || user?.id === item.issue?.project?.owner?.id

  return (
    <div className="flex justify-between items-start gap-4 p-3 rounded-md bg-slate-50/60 border border-slate-100">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-slate-200 text-slate-800 font-semibold">
            {item.user?.fullName ? item.user.fullName[0].toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-gray-800 leading-none">
              {item.user?.fullName || 'Anonymous'}
            </p>
            {(item.createdDateTime || item.createdAt) && (
              <span className="text-[11px] text-gray-400">
                • {formatCommentDate(item.createdDateTime || item.createdAt)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{item.content}</p>
        </div>
      </div>

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 hover:text-red-600"
          onClick={handleDelete}
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}

export default CommentCard