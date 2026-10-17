import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { acceptInvitation } from '@/Redux/Project/Action'

const AcceptInvitation = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const handleAcceptInvitation = () => {
    if (token) {
      dispatch(acceptInvitation({ token, navigate }))
    }
  }

  return (
    <div className="h-[80vh] flex flex-col justify-center items-center gap-5 text-center px-4">
      <h1 className="text-2xl font-bold text-gray-800">
        You are invited to join the project!
      </h1>
      <p className="text-sm text-gray-500 max-w-sm">
        Click the button below to accept your invitation and start collaborating with your team.
      </p>
      <Button
        onClick={handleAcceptInvitation}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
      >
        Accept Invitation
      </Button>
    </div>
  )
}

export default AcceptInvitation