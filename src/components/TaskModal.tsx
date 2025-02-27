import { useEffect, useState } from "react";
import { Task, useTaskStore } from "../stores/taskStore";
import SuccessModal from "./SuccessModal";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  mode: "add" | "edit";
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, mode }) => {
  const { createTask, updateTaskById } = useTaskStore();
  const [taskData, setTaskData] = useState({
    id: "", // Ensure every task has a unique id
    title: "",
    description: "",
    dueDate: "",
    status: "todo",
  });
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (task && mode === "edit") {
      setTaskData({
        id: task.id || "", // Keep the existing id when editing
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate || "",
        status: task.status || "todo",
      });
    } else {
      setTaskData({
        id: crypto.randomUUID(), // Generate a new unique id when adding a task
        title: "",
        description: "",
        dueDate: "",
        status: "todo",
      });
    }
  }, [task, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "add") {
        await createTask(taskData);
        await useTaskStore.getState().fetchTasks();
        setSuccessModalOpen(true);
      } else if (mode === "edit" && task) {
        await updateTaskById(task.id, taskData);
        onClose();  // Close the modal before reloading
        setTimeout(() => {
          window.location.reload();
        }, 100);  // Slight delay to ensure state updates before reload
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#00000030] bg-opacity-50 z-40 flex items-center justify-center">
        <div className="z-50 p-6 max-h-screen overflow-y-auto bg-white rounded-xl w-[380px] shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 bg-teal-400 rounded-full"></span>
              <h2 className="text-lg font-semibold text-gray-800">{mode === "add" ? "Add Task" : "Edit Task"}</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Task Name</label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter task name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <textarea
                name="description"
                required
                value={taskData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px] resize-none"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Deadline</label>
                <input
                  type="date"
                  name="dueDate"
                  value={taskData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select
                  name="status"
                  value={taskData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="todo">To Do</option>
                  <option value="onProgress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="timeOut">Time Out</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
            >
              {mode === "add" ? "Add Task" : "Update Task"}
            </button>
          </form>
        </div>

        <SuccessModal
          isOpen={successModalOpen}
          onClose={() => {
            setSuccessModalOpen(false);
            onClose();
          }}
          message="New task has been created successfully!"
        />
      </div>
    </>
  );
};

export default TaskModal;
