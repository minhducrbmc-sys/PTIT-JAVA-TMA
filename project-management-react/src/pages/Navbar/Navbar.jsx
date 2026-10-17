import React, { useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PersonIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import CreateProjectForm from '../Project/CreateProjectForm'
import { logout } from '@/Redux/Auth/Action'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const auth = useSelector((store) => store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentSearch = searchParams.get('search') || ''

  const handleSearchChange = (e) => {
    const value = e.target.value
    const params = new URLSearchParams(searchParams)

    if (value.trim()) {
      params.set('search', value)
    } else {
      params.delete('search')
    }

    // Always ensure we are on the home/project list page when searching
    if (location.pathname !== '/') {
      navigate(`/?${params.toString()}`)
    } else {
      setSearchParams(params)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="sticky top-0 z-50 border-b border-red-700 bg-red-600 text-white py-3 px-5 flex items-center justify-between shadow-md gap-4">
      {/* Brand & New Project */}
      <div className="flex items-center gap-4">
        <p
          onClick={() => navigate('/')}
          className="cursor-pointer font-bold text-md text-white hover:text-red-100 transition-colors whitespace-nowrap"
        >
          Project Tracker IT
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-white hover:bg-red-700 hover:text-white"
            >
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <CreateProjectForm onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-sm">
        <MagnifyingGlassIcon className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search projects..."
          value={currentSearch}
          onChange={handleSearchChange}
          className="pl-9 h-9 bg-white text-gray-900 placeholder:text-gray-400 rounded-md border-0 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-white"
        />
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-2 border-white/60 bg-red-600 text-white hover:bg-red-700 hover:text-white"
            >
              <PersonIcon className="h-4 w-4 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <p className="font-medium text-white text-sm whitespace-nowrap">
          {auth?.user?.fullName}
        </p>
      </div>
    </div>
  )
}

export default Navbar