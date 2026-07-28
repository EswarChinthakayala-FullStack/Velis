import { z } from 'zod';

export interface TaskFormValues {
  projectId: string;
  title: string;
  description: string;
  module: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'testing' | 'completed';
  dueDate: string;
  progress: number;
  labels: string[];
}

export const taskSchema = z.object({
  projectId: z
    .string()
    .min(1, 'Project selection is required.'),
  title: z
    .string()
    .min(1, 'Task title is required.')
    .max(150, 'Title cannot exceed 150 characters.'),
  description: z
    .string()
    .max(5000, 'Description cannot exceed 5000 characters.'),
  module: z
    .string()
    .max(50, 'Module name cannot exceed 50 characters.'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['todo', 'in_progress', 'review', 'testing', 'completed']),
  dueDate: z
    .string(),
  progress: z
    .number()
    .min(0, 'Progress cannot be negative.')
    .max(100, 'Progress cannot exceed 100%.'),
  labels: z
    .array(z.string()),
});
