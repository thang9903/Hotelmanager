import styled from "styled-components";
import backgroundImage from "../assets/images/bg.jpg";

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  font-family: "Roboto", sans-serif;
`;

export const BoxContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 40px;
  background: #ffffff;
  border-radius: 15px;
  border: 2px solid #2575fc;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  color: #333333;
  font-size: 28px;
  font-weight: 700;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Input = styled.input`
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2575fc;
    box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
  }
`;

export const MutedLink = styled.a`
  font-size: 14px;
  color: #6c757d;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #2575fc;
  }
`;

export const SubmitButton = styled.button`
  padding: 12px 15px;
  font-size: 16px;
  color: #ffffff;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #5a0fb4, #1e63d9);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const LineText = styled.p`
  font-size: 14px;
  color: #6c757d;
  margin-top: 15px;
`;

export const BoldLink = styled.a`
  font-weight: bold;
  color: #2575fc;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #1e63d9;
  }
`;
