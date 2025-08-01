import styled from "styled-components";

export const BoxContainer = styled.div`
  width: 400px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  margin: 50px auto;
`;

export const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Input = styled.input`
  width: 90%;
  height: 40px;
  margin: 10px 0;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 45px;
  margin: 20px 0;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const MutedLink = styled.a`
  font-size: 14px;
  color: #aaa;
  text-decoration: none;
  margin: 10px 0;

  &:hover {
    color: #007bff;
  }
`;

export const LineText = styled.p`
  font-size: 14px;
  color: #555;
  margin: 10px 0;
`;

export const BoldLink = styled.a`
  font-size: 14px;
  color: #007bff;
  font-weight: bold;
  text-decoration: none;
  margin-left: 5px;

  &:hover {
    text-decoration: underline;
  }
`;
