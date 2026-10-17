import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import {
  fetchChatByProject,
  fetchChatMessages,
  sendMessage,
} from '@/Redux/Chat/Action'

const ChatBox = () => {
  const [message, setMessage] = useState('')
  const auth = useSelector((store) => store.auth)
  const chat = useSelector((store) => store.chat)
  const { id } = useParams()
  const dispatch = useDispatch()
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchChatByProject(id))
      dispatch(fetchChatMessages(id))
    }
  }, [id, dispatch])

  // Scroll ONLY the internal viewport, preventing window/page scroll
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [chat?.messages])

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
  }
  // Poll for new messages every 3 seconds
useEffect(() => {
  if (!id) return

  const intervalId = setInterval(() => {
    dispatch(fetchChatMessages(id))
  }, 3000)

  return () => clearInterval(intervalId) // Clean up on unmount
}, [id, dispatch])

  const handleSendMessage = (e) => {
    e?.preventDefault()
    if (!message.trim()) return

    dispatch(
      sendMessage({
        senderId: auth.user?.id,
        projectId: id,
        content: message,
      })
    )
    setMessage('')
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div className="sticky">
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <h1 className="border-b p-4 font-semibold text-gray-800 text-sm">
          Chat Box
        </h1>

        <ScrollArea
          ref={scrollAreaRef}
          className="h-[32rem] w-full p-4 flex flex-col gap-3"
        >
          {chat.messages && chat.messages.length > 0 ? (
            chat.messages.map((item, index) =>
              item.sender?.id !== auth.user?.id ? (
                // Incoming Message (Left Aligned)
                <div
                  key={item.id || index}
                  className="flex gap-2 mb-3 justify-start items-end"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-slate-200 text-slate-800 font-semibold">
                      {item.sender?.fullName
                        ? item.sender.fullName[0].toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 py-2 px-3 border rounded-ss-2xl rounded-e-xl bg-slate-50 max-w-[75%] shadow-xs">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-semibold text-gray-700">
                        {item.sender?.fullName || 'Anonymous'}
                      </p>
                      {item.createdAt && (
                        <span className="text-[10px] text-gray-400">
                          {formatTime(item.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed break-words">
                      {item.content}
                    </p>
                  </div>
                </div>
              ) : (
                // Outgoing Message (Right Aligned)
                <div
                  key={item.id || index}
                  className="flex gap-2 mb-3 justify-end items-end"
                >
                  <div className="space-y-1 py-2 px-3 border border-red-100 rounded-se-2xl rounded-s-xl bg-red-50/50 max-w-[75%] shadow-xs">
                    <div className="flex items-center justify-end gap-2">
                      {item.createdAt && (
                        <span className="text-[10px] text-gray-400">
                          {formatTime(item.createdAt)}
                        </span>
                      )}
                      <p className="text-[11px] font-semibold text-red-700">
                        {item.sender?.fullName || 'You'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-800 text-left leading-relaxed break-words">
                      {item.content}
                    </p>
                  </div>
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-red-600 text-white font-semibold">
                      {item.sender?.fullName
                        ? item.sender.fullName[0].toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )
            )
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-400">
              No messages yet.
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="relative border-t bg-white">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={handleMessageChange}
            className="py-6 pl-4 pr-12 text-xs border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none shadow-none"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full"
          >
            <PaperPlaneIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox