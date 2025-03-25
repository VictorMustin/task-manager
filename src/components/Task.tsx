import { useSortable } from '@dnd-kit/sortable'
import { Task as TaskType } from '@/types/task'
import { Button } from '@/components/ui/button'
import { GripVertical, MoreHorizontal, Trash, Pencil } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { STAGES, STAGE_ICONS } from '@/App'
import { useState } from 'react'
import { EditTaskDialog } from '@/components/EditTaskDialog'
import { DeleteTaskDialog } from '@/components/DeleteTaskDialog'
import { useTaskContext } from '@/providers/TaskProvider'

interface TaskProps {
  task: TaskType
}

export function Task({ task }: TaskProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { moveTask } = useTaskContext()

  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: task.id,
  })

  const handleEditClick = () => {
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  return (
    <div
      ref={setNodeRef}
      className={`relative group mb-2 transition-transform`}
    >
      <div
        className={cn(
          isDragging && 'opacity-50',
          'p-2 rounded-md bg-card text-card-foreground border'
        )}
      >
        <div className='flex items-start gap-2'>
          <Button
            variant='ghost'
            size='icon'
            className='cursor-grab active:cursor-grabbing size-6'
            {...attributes}
            {...listeners}
          >
            <GripVertical className='h-4 w-4 text-muted-foreground' />
            <span className='sr-only'>Drag handle</span>
          </Button>
          <div className='mr-auto overflow-hidden'>
            <h3 className='font-medium truncate'>{task.title}</h3>
            <p className='text-muted-foreground text-sm whitespace-normal break-words'>
              {task.description}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='size-6'>
                <MoreHorizontal className='h-4 w-4' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {STAGES.filter((stage) => stage !== task.stage).map((stage) => {
                const Icon = STAGE_ICONS[stage]
                return (
                  <DropdownMenuItem
                    key={stage}
                    onClick={() => moveTask(task.id, stage)}
                  >
                    <Icon className='mr-2 h-4 w-4' />
                    {stage}
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEditClick}>
                <Pencil className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive focus:text-destructive'
                onClick={handleDeleteClick}
              >
                <Trash className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        task={task}
      />

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        task={task}
      />
    </div>
  )
}
