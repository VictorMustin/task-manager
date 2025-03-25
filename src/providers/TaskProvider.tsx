import { createContext, useContext, useEffect, useState } from 'react'
import { Task, TaskStage } from '../types/task'
import { arrayMove } from '@dnd-kit/sortable'
import { DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { STAGES } from '../App'
interface TaskContextType {
  tasks: Task[]
  activeTask: Task | null
  addTask: (title: string, description: string, stage?: TaskStage) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStage: TaskStage) => void
  editTask: (id: string, title: string, description: string) => void
  handleDragStart: (event: DragStartEvent) => void
  handleDragOver: (event: DragOverEvent) => void
  handleDragEnd: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

// Helper function to deduplicate tasks
const deduplicateTasks = (tasks: Task[]): Task[] => {
  const seen = new Set<string>()
  const uniqueTasks: Task[] = []

  for (const task of tasks) {
    if (!seen.has(task.id)) {
      seen.add(task.id)
      uniqueTasks.push(task)
    }
  }

  return uniqueTasks
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks')
    const parsedTasks = saved ? JSON.parse(saved) : []
    // Deduplicate tasks on initial load
    return deduplicateTasks(parsedTasks)
  })

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  useEffect(() => {
    // Deduplicate before saving to localStorage
    const uniqueTasks = deduplicateTasks(tasks)
    if (uniqueTasks.length !== tasks.length) {
      setTasks(uniqueTasks)
    } else {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = (
    title: string,
    description: string,
    stage: TaskStage = 'Pending'
  ) => {
    setTasks((prev) => {
      const newTask = {
        id: crypto.randomUUID(),
        title,
        description,
        stage,
      }
      return [...prev, newTask]
    })
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const moveTask = (taskId: string, newStage: TaskStage) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, stage: newStage } : task
      )
    )
  }

  const editTask = (id: string, title: string, description: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title, description } : task
      )
    )
  }

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeId = active.id as string

    // Store the original stage of the task being dragged
    const task = tasks.find((t) => t.id === activeId)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Skip if hovering over the same item
    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    // If dropping over another task
    const overTask = tasks.find((t) => t.id === overId)
    if (overTask) {
      if (activeTask.stage !== overTask.stage) {
        // Move to different stage at specific position
        const taskIndex = tasks.findIndex((t) => t.id === activeId)
        const targetIndex = tasks.findIndex((t) => t.id === overId)

        if (taskIndex === -1 || targetIndex === -1) return

        const updatedTask = { ...tasks[taskIndex], stage: overTask.stage }
        const result = [...tasks]
        result.splice(taskIndex, 1)
        result.splice(targetIndex, 0, updatedTask)

        setTasks(result)
      } else {
        // Reorder within same stage
        const taskIndex = tasks.findIndex((t) => t.id === activeId)
        const targetIndex = tasks.findIndex((t) => t.id === overId)

        if (taskIndex === -1 || targetIndex === -1) return

        setTasks(arrayMove(tasks, taskIndex, targetIndex))
      }
    }
    // If dropping over a column/stage
    else if (STAGES.includes(overId as TaskStage)) {
      const newStage = overId as TaskStage
      if (activeTask.stage !== newStage) {
        moveTask(activeId, newStage)
      }
    }
  }

  const handleDragEnd = () => {
    setActiveTask(null)
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activeTask,
        addTask,
        deleteTask,
        moveTask,
        editTask,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}
