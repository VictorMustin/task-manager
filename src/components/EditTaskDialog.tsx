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
import { Task } from '@/types/task'
import { useTaskContext } from '@/providers/TaskProvider'
interface EditTaskDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  task: Task
}

export function EditTaskDialog({
  isOpen,
  onOpenChange,
  task,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)

  const { editTask } = useTaskContext()

  // Reset form values when dialog opens or initialValues change
  useEffect(() => {
    if (isOpen) {
      setTitle(task.title)
      setDescription(task.description)
    }
  }, [isOpen, task.title, task.description])

  const handleSave = () => {
    if (title.trim()) {
      editTask(task.id, title, description)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className='sm:max-w-[425px]'
        aria-describedby='edit-task-description'
      >
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
          <Button variant='outline' onClick={() => onOpenChange(false)}>
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
