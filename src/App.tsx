import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragOverlay,
  MeasuringStrategy,
} from '@dnd-kit/core'
import { useTaskContext } from './providers/TaskProvider'
import { Task } from './components/Task'
import { createPortal } from 'react-dom'
import { ClipboardList, Clock, CheckCircle2 } from 'lucide-react'
import { Column } from './components/Column'
import { TaskStage } from './types/task'
import { ModeToggle } from './components/ThemeToggle'
import { Button } from './components/ui/button'
import { Github } from 'lucide-react'

// Move constants directly into App.tsx
export const STAGES: TaskStage[] = ['Pending', 'In Progress', 'Complete']

export const STAGE_ICONS = {
  Pending: ClipboardList,
  'In Progress': Clock,
  Complete: CheckCircle2,
}

function App() {
  const { tasks, activeTask, handleDragStart, handleDragOver, handleDragEnd } =
    useTaskContext()

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  return (
    <div className='min-h-screen bg-background p-8 flex flex-col'>
      <div className='max-w-6xl mx-auto w-full flex-1'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold'>Task Manager</h1>
          <ModeToggle />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {STAGES.map((stage) => (
              <Column key={stage} id={stage} tasks={tasks} />
            ))}
          </div>

          {typeof document !== 'undefined' &&
            createPortal(
              <DragOverlay>
                {activeTask && <Task task={activeTask} />}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </div>

      <footer className='mt-auto pt-8 pb-4 w-full'>
        <div className='max-w-6xl mx-auto flex flex-col items-center gap-2'>
          <Button variant='link' asChild>
            <a
              href='https://github.com/VictorMustin/task-manager'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2'
            >
              <Github size={18} />
              View on GitHub
            </a>
          </Button>
          <p className='text-sm text-muted-foreground'>Made by Victor Mustin</p>
        </div>
      </footer>
    </div>
  )
}

export default App
