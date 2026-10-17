import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileTextIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import api from '@/config/api'

const SubmitFileBox = ({ issueId, creatorEmail, creatorName }) => {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setSuccess(false)
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please choose a file to send.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('message', message)

    setLoading(true)
    setError(null)

    try {
      await api.post(`/api/issues/${issueId}/submit-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setSuccess(true)
      setFile(null)
      setMessage('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send file. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="rounded-lg shadow-xs border bg-slate-50/50">
      <CardHeader className="py-3 px-4 border-b">
       <CardTitle className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
  <FileTextIcon className="h-4 w-4" /> Send File to Task Issuer
</CardTitle>
        <p className="text-[11px] text-gray-500">
          Recipient: <span className="font-medium text-gray-700">{creatorName || 'Issuer'}</span> ({creatorEmail || 'No email'})
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {success && (
          <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md">
            <CheckCircledIcon className="h-4 w-4 text-emerald-600" />
            File successfully sent to {creatorName}!
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="file"
              onChange={handleFileChange}
              disabled={loading}
              className="text-xs h-9 cursor-pointer file:text-xs file:font-semibold"
            />
          </div>

          <Textarea
            placeholder="Add an optional note or summary..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            rows={2}
            className="text-xs resize-none"
          />

          <Button
            type="submit"
            disabled={loading || !file}
            className="w-full h-8 text-xs font-medium"
          >
            {loading ? 'Sending File...' : 'Email File to Issuer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default SubmitFileBox