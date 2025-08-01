import styled from "styled-components";

export const Card = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
