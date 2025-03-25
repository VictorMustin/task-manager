import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Plus } from 'lucide-react'
import { TaskStage } from '@/types/task'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

interface AddTaskButtonProps {
  stage: TaskStage
  onAddTask: (title: string, description: string, stage: TaskStage) => void
}

export function AddTaskButton({ stage, onAddTask }: AddTaskButtonProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    onAddTask(newTaskTitle.trim(), newTaskDescription.trim(), stage)
    setNewTaskTitle('')
    setNewTaskDescription('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost'>
          <Plus className='h-4 w-4' strokeWidth={2.5} />
          New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task to {stage}</DialogTitle>
            <DialogDescription>
              Create a new task that will be added to the {stage} column.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <Input
              type='text'
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder='Task title'
              className='w-full'
            />
            <Textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder='Task description'
              className='w-full'
            />
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit'>Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
