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

// Move constants directly into App.tsx
export const STAGES: TaskStage[] = ['Pending', 'In Progress', 'Complete']

export const STAGE_ICONS = {
  Pending: ClipboardList,
  'In Progress': Clock,
  Complete: CheckCircle2,
}

function App() {
  const {
    tasks,
    activeTask,
    addTask,
    deleteTask,
    moveTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useTaskContext()

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-6xl mx-auto'>
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
              <Column
                key={stage}
                id={stage}
                tasks={tasks}
                onDelete={deleteTask}
                onMove={moveTask}
                onAddTask={addTask}
              />
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
    </div>
  )
}

export default App
