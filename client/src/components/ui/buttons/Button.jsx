import styled from "styled-components";

const UiButton = styled.button`
  font-family: "Manrope", sans-serif;
  font-weight: ${({ color }) => (!color || color === "#f0f0f0" ? 500 : 700)};
  padding: 0.4rem 0.6rem;
  height: 29px;
  font-size: 0.9rem;
  border: none;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ color }) => color || "#f0f0f0"};
  color: ${({ color }) => (!color || color === "#f0f0f0" ? "#000" : "#fff")};
  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

export const Button = ({ children, onClick, color }) => {
  return (
    <div onClick={onClick}>
      <UiButton color={color}>{children}</UiButton>
    </div>
  );
};
