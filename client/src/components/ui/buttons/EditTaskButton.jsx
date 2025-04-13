import { HiPencil } from "react-icons/hi";

export default function EditTaskButton({ onClick }) {
  return (
    <button onClick={onClick} className="edit-button">
      <HiPencil className="edit-icon" size={12} strokeWidth="0.05rem" />
    </button>
  );
}
