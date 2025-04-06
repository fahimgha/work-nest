import styled from "styled-components";

const UiButton = styled.button`
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 0.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Button = ({ children, onClick }) => {
  return (
    <section onClick={onClick}>
      <UiButton>{children}</UiButton>
    </section>
  );
};
