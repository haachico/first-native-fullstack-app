
  export type task = {
    title: string;
    description: string;
    completed: boolean;
    image?: string | null; // Optional image field
    id: number; // Unique ID for the task
  };