import { HiX } from "react-icons/hi";
export default function DeleteTaskButton({ onClick }) {
  return (
    <button onClick={onClick} className="del-button">
      <HiX className="hix-icon" size={12} strokeWidth="0.05rem" />
    </button>
  );
}
