import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "https://seequenze-technologies-assignment-api.vercel.app";

export interface Task {
	id: string;
	title: string;
	description: string;
	dueDate: string;
	status: string;
}

export interface TaskStore {
	tasks: Task[];
	selectedTask: Task | null;
	setTasks: (tasks: Task[]) => void;
	setSelectedTask: (task: Task | null) => void;
	addTask: (task: Task) => void;
	updateTask: (task: Task) => void;
	deleteTask: (taskId: string) => void;
	fetchTasks: () => Promise<void>;
	fetchTask: (id: string) => Promise<void>;
	createTask: (task: Omit<Task, "id">) => Promise<void>;
	updateTaskById: (id: string, task: Partial<Task>) => Promise<void>;
	deleteTaskById: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
	tasks: [],
	selectedTask: null,

	setTasks: (tasks) => set({ tasks }),

	setSelectedTask: (task) => set({ selectedTask: task }),

	addTask: (task) =>
		set((state) => ({
			tasks: [...state.tasks, task],
		})),

	updateTask: (task) =>
		set((state) => ({
			tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
		})),

	deleteTask: (taskId) =>
		set((state) => ({
			tasks: state.tasks.filter((t) => t.id !== taskId),
		})),

	fetchTasks: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/tasks`);
			set({ tasks: response.data });
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	},

	fetchTask: async (id) => {
		try {
			const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
			set({ selectedTask: response.data });
		} catch (error) {
			console.error("Error fetching task:", error);
		}
	},

	createTask: async (task) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/tasks`, task);
			const createdTask = response.data; // Ensure we get the correct ID
			set((state) => ({ tasks: [...state.tasks, createdTask] }));
		} catch (error) {
			console.error("Error creating task:", error);
		}
	},

	updateTaskById: async (id, task) => {
		try {
			const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, task);
			set((state) => ({
				tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
			}));
		} catch (error) {
			console.error("Error updating task:", error);
		}
	},

	deleteTaskById: async (id) => {
		try {
			await axios.delete(`${API_BASE_URL}/tasks/${id}`);
			set((state) => ({
				tasks: state.tasks.filter((t) => t.id !== id),
			}));
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	},
}));