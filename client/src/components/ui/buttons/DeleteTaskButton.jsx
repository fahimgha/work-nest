import { HiX } from "react-icons/hi";
import styled from "styled-components";

const UiDelButton = styled.button`
  background-color: white;
  border: 0.1rem solid #929292;
  border-radius: 0.1rem;
  cursor: pointer;
  padding: 0;
  display: none;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0.1rem;
  z-index: 1;

  &.always-visible {
    display: flex !important;
  }
  &:hover {
    background: #cf352e;
    border-color: #cf352e;
    .hix-icon {
      color: white;
      transition: background 0.2s, stroke-dashoffset 0.3s;
    }
  }
`;
export default function DeleteTaskButton({ onClick, className }) {
  return (
    <button onClick={onClick} className={`del-button ${className}`.trim()}>
      <HiX className="hix-icon" size={12} strokeWidth="0.05rem" />
    </button>
  );
}
