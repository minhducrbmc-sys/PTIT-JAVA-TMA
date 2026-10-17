import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import IssueCard from './IssueCard'
import CreateIssueForm from './CreateIssueForm'
import { fetchIssues } from '@/Redux/Issue/Action'

const IssueList = ({ title, status, projectId }) => {
  const dispatch = useDispatch()
  const { issue } = useSelector((store) => store)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (projectId) {
      dispatch(fetchIssues(projectId))
    }
  }, [projectId, dispatch])

  const currentIssues = issue.issues?.filter((item) => item.status === status) || []

  return (
    <div className="w-full">
      <Card className="rounded-md border shadow-none bg-slate-50/40">
        {/* Compact Header */}
        <CardHeader className="px-3 py-2 border-b">
          <CardTitle className="text-xs font-semibold text-gray-700">{title}</CardTitle>
        </CardHeader>

        {/* Compact Content */}
        <CardContent className="px-3 py-2 space-y-1.5">
          {currentIssues.length > 0 ? (
            currentIssues.map((item) => (
              <IssueCard key={item.id} item={item} projectId={projectId} />
            ))
          ) : (
            <p className="text-[11px] text-gray-400 py-2 text-center">No tasks</p>
          )}
        </CardContent>

        {/* Compact Footer with smaller button */}
        {status === 'pending' && (
          <CardFooter className="px-3 py-1.5 border-t">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-7 text-xs font-medium text-gray-600 flex items-center justify-center gap-1.5 hover:bg-slate-200"
                >
                  <PlusIcon className="w-3 h-3" /> Create Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <CreateIssueForm status="pending" setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default IssueList