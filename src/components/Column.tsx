import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task } from './Task'
import { TaskStage } from '../types/task'
import { STAGE_ICONS } from '../App'
import { AddTaskButton } from './AddTaskDialog'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ColumnProps {
  id: TaskStage
  tasks: any[]
}

export function Column({ id, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  // Filter tasks for this stage
  const stageTasks = tasks.filter((task) => task.stage === id)
  const taskIds = stageTasks.map((task) => task.id)

  return (
    <div key={id} id={id}>
      <div
        className='flex items-center gap-2 px-2 py-1 rounded-md w-fit font-medium mb-4'
        style={{
          color: `var(--stage-${id.toLowerCase().replace(' ', '-')}-color)`,
          backgroundColor: `color-mix(in srgb, var(--stage-${id
            .toLowerCase()
            .replace(' ', '-')}-color) 10%, transparent)`,
        }}
      >
        {React.createElement(STAGE_ICONS[id], {
          size: 18,
          strokeWidth: 2.5,
        })}
        {id}
      </div>
      <div className='space-y-4'>
        <div ref={setNodeRef} className='transition-all duration-200'>
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {stageTasks.map((task) => (
              <AnimatedTask key={`task-${task.id}`} task={task} />
            ))}
          </SortableContext>
        </div>
        <AddTaskButton stage={id} />
      </div>
    </div>
  )
}

// Create a wrapper component that adds animation to tasks
function AnimatedTask({ task }: { task: any }) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='transition-transform duration-200'
    >
      <Task task={task} />
    </div>
  )
}
