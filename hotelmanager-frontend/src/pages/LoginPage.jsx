import React, { useContext } from "react";
import { Marginer } from "../components/marginer/index";
import {
  PageContainer,
  BoxContainer,
  Title,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
  LineText,
  BoldLink,
} from "../styles/LoginPageStyles";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../store/UserContext";

const LoginPage = () => {
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const { loginContext } = useContext(UserContext);

  const handleLogin = async () => {
    const res = await login(userName, password);
    if (res) {
      loginContext(res.access_token, res.user);
      const user = res.user;
      console.log("=========================", user);
      if (user.role === "Quản lý") navigate("/overview");
      else navigate("/booking");
    }
  };
  return (
    <PageContainer>
      <BoxContainer>
        <Title>Đăng Nhập</Title>
        <FormContainer>
          <Input
            placeholder="Tên đăng nhập"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormContainer>
        <Marginer direction="vertical" margin={15} />
        <MutedLink href="#">Quên mật khẩu?</MutedLink>
        <Marginer direction="vertical" margin="1.6em" />
        <SubmitButton onClick={handleLogin}>Đăng Nhập</SubmitButton>
        <Marginer direction="vertical" margin="10px" />
        <LineText>
          Bạn chưa có tài khoản?
          <BoldLink href="#"> Đăng ký ngay</BoldLink>
        </LineText>
      </BoxContainer>
    </PageContainer>
  );
};

export default LoginPage;
