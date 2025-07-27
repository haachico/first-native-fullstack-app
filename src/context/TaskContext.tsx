
//help me with setting the context

import { task } from '@/types/tasks';
import React, { createContext, useState, ReactNode, useContext } from 'react';


type TaskContextType = {
  tasks: task[];
  addTask: (task: Omit<task, 'completed' | 'id'>) => void;
  toggleTaskCompletion: (id: number) => void;
  updateTask: (task: task) => void; // Optional for future use
    removeTask: (id: number) => void;
};


export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<task[]>([]);

  const addTask = (task: Omit<task, 'completed' | 'id'>) => {
    const newTask: task = {
      ...task,
      completed: false,
      id: Date.now(), // Unique ID for the task
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTask = (updatedTask: task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
};

  const removeTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion, removeTask , updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
