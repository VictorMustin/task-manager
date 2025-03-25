import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Task } from '@/types/task'
import { useTaskContext } from '@/providers/TaskProvider'

interface DeleteTaskDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  task: Task
}

export function DeleteTaskDialog({
  isOpen,
  onOpenChange,
  task,
}: DeleteTaskDialogProps) {
  const { deleteTask } = useTaskContext()

  const handleConfirm = () => {
    deleteTask(task.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            Delete
            <span className='inline-block max-w-64 truncate align-bottom mx-1'>
              {task.title}
            </span>
            ?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
