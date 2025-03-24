import { createContext } from "react";

// creation du context
export const TaskContext = createContext({ tasks: {}, setTasks: () => {} });
