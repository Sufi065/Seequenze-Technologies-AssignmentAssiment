interface TaskMenuProps {
	isOpen: boolean;
	onClose: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const TaskMenu: React.FC<TaskMenuProps> = ({ isOpen, onClose, onEdit, onDelete }) => {
	if (!isOpen) return null;

	return (
		<div className="absolute bg-white shadow-xl rounded-lg py-2 z-10 w-36 ml-[175px] mt-6 border border-gray-200">
			<button
				onClick={() => {
					onEdit();
					onClose();
				}}
				className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-medium transition-colors"
			>
				Edit
			</button>
			<hr className="border-gray-200" />
			<button
				onClick={() => {
					onDelete();
					onClose();
				}}
				className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 text-sm font-medium transition-colors"
			>
				Delete
			</button>
		</div>
	);
};

export default TaskMenu;
