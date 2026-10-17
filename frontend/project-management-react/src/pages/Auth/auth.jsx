import React, { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import { Button } from '@/components/ui/button'
import './auth.css'

const Auth = () => {
  const [active, setActive] = useState(true)

  return (
    <div className="loginContainer">
      <div className="box">
        <div className="loginBox">
          {active ? <SignUp /> : <Login />}
          <div className="flex items-center justify-center pt-4">
            <span className="text-xs text-gray-400">
              {active ? 'Already have an account? ' : "Don't have an account with us? "}
            </span>
            <Button
              variant="ghost"
              className="text-xs ml-1"
              onClick={() => setActive(!active)}
            >
              {active ? 'Sign in' : 'Sign up'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth