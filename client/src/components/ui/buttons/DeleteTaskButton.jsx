import { HiX } from "react-icons/hi";

export default function DeleteTaskButton({ onClick, className }) {
  return (
    <button onClick={onClick} className={className}>
      <HiX className="hix-icon" size={12} strokeWidth="0.05rem" />
    </button>
  );
}
