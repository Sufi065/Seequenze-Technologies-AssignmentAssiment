import { useState } from "react";
import { Task } from "../stores/taskStore";
import TaskMenu from "./TaskMenu";

interface TaskCardProps {
	task: Task;
	onEdit: (task: Task) => void;
	onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const handleMenuClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setMenuOpen(!menuOpen);
	};

	return (
		<div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-md relative">
			<div className="flex justify-between items-start mb-3">
				<div></div>
				<button type="button" className="text-gray-400 hover:text-gray-600 p-2" onClick={handleMenuClick}>
					<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
					</svg>
				</button>

				<TaskMenu
					isOpen={menuOpen}
					onClose={() => setMenuOpen(false)}
					onEdit={() => onEdit(task)}
					onDelete={() => onDelete(task.id)}
				/>
			</div>

			<h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
			{task.description && <p className="text-gray-700 text-sm mb-3 line-clamp-2">{task.description}</p>}

			<div className="text-xs font-medium text-gray-600">
				<span>Deadline: {task.dueDate}</span>
			</div>
		</div>
	);
};

export default TaskCard;
