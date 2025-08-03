
//help me with setting the context

import { task } from '@/types/tasks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';


type TaskContextType = {
  tasks: task[];
  addTask: (task: Omit<task, 'completed' | 'id'>) => void;
  toggleTaskCompletion: (id: number) => void;
  updateTask: (task: task) => void; // Optional for future use
  token?: string | null; // Optional for future use
  setToken: (token: string | null) => void; // Optional for future use
    removeTask: (id: number) => void;
  fetchTasks: () => void; // Optional for future use
};


const API_URL = "http://192.168.0.105/todo-api/tasks";

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<task[]>([]);
const [token, setToken] = useState<string | null>( null); // Optional for future use


useEffect(() => {
  if (token) {
    fetchTasks();
  }
}, [token]);


  //   useEffect(() => {
  //   const fetchToken = async () => {
  //     const storedToken = await AsyncStorage.getItem('token');
  //     setToken(storedToken);
  //   };
  //   fetchToken();
  // }, []);
  


  const fetchTasks = async () => {
    console.log('Fetching tasks with token:', token);
    try {
      const response = await fetch(`${API_URL}/read.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      console.log('Tasks fetched:', response);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  useEffect(() => {

    fetchTasks();
  }, []);

  const addTask = async (task: Omit<task, 'completed' | 'id'>) => {
    console.log('Adding task with token:', token);
    const newTask: task = {
      ...task,
      completed: false,
      id: Date.now(), // Unique ID for the task
    };


    try {
      const response = await fetch(`${API_URL}/create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });


      console.log('Task added:', response);
      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const addedTask = await response.json();

      fetchTasks(); // Refresh the task list after adding a new task
      console.log('Task added:', addedTask);
      // setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }

    

  };

  const toggleTaskCompletion = async (id: number) => {
    // setTasks((prevTasks) =>
    //   prevTasks.map((task) =>
    //     task.id === id ? { ...task, completed: !task.completed } : task
    //   )
    // );

    try {
      const response = await fetch(`${API_URL}/complete.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
      });

      console.log('Task completion toggled:', response);
      if (!response.ok) {
        throw new Error('Failed to toggle task completion');
      }

      fetchTasks(); // Refresh the task list after toggling completion
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const updateTask = async (updatedTask: task) => {
    // setTasks((prevTasks) =>
    //   prevTasks.map((task) =>
    //     task.id === updatedTask.id ? updatedTask : task
    //   )
    // );

    try {
      const response = await fetch(`${API_URL}/update.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      console.log('Task updated:', response);
      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      fetchTasks(); // Refresh the task list after updating a task
    } catch (error) {
      console.error('Error updating task:', error);
    }
};

  const removeTask = async (id: number) => {
    // setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    try {
      const response = await fetch(`${API_URL}/delete.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      console.log('Task deleted:', response);
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      

      fetchTasks(); // Refresh the task list after deleting a task
    } catch (error) {
      console.error('Error deleting task:', error);
    }

  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion, token, setToken, removeTask , updateTask, fetchTasks }}>
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
