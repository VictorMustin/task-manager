import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface EditTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (title: string, description: string) => void
  initialTitle: string
  initialDescription: string
}

export function EditTaskDialog({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialDescription,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)

  // Reset form values when dialog opens or initialValues change
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle)
      setDescription(initialDescription)
    }
  }, [isOpen, initialTitle, initialDescription])

  const handleSave = () => {
    if (title.trim()) {
      onSave(title, description)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]' aria-describedby="edit-task-description">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Task title'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Task description'
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
