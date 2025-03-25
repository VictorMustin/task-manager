export type TaskStage = 'Pending' | 'In Progress' | 'Complete';

export interface Task {
  id: string;
  title: string;
  description: string;
  stage: TaskStage;
} 