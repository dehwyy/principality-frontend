import "./LoginPage.css";
import { FC, FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { BlockingSpinner } from "../components/BlockingSpinner";
import { useAppDispatch, useAppSelector } from "../store";
import { loggedIn } from "../slices/archaeologistSlice";
import { loginArchaeologist } from "../modules/archaeologistApi";

export const LoginPage: FC = () => {
  const [archaeologistLogin, setArchaeologistLogin] = useState("");
  const [archaeologistPassword, setArchaeologistPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.archaeologist.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.PRINCIPALITIES} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setLoginError(null);
    try {
      const accessToken = await loginArchaeologist({
        archaeologist_login: archaeologistLogin,
        archaeologist_password: archaeologistPassword,
      });
      dispatch(loggedIn({ accessToken, archaeologistLogin }));
      navigate(ROUTES.PRINCIPALITIES);
    } catch {
      setLoginError("Неверный логин или пароль археолога");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="archaeologistLogin">
      <h1 className="archaeologistLogin__title">Вход археолога</h1>
      <Form className="archaeologistLogin__form" onSubmit={handleSubmit}>
        <Form.Group controlId="archaeologist_login">
          <Form.Label>Логин</Form.Label>
          <Form.Control
            value={archaeologistLogin}
            autoComplete="username"
            required
            maxLength={25}
            onChange={(event) => setArchaeologistLogin(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="archaeologist_password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={archaeologistPassword}
            autoComplete="current-password"
            required
            onChange={(event) => setArchaeologistPassword(event.target.value)}
          />
        </Form.Group>
        {loginError && <Alert variant="danger">{loginError}</Alert>}
        <Button type="submit" className="archaeologistLogin__submit" disabled={pending}>
          Войти
        </Button>
      </Form>
      {pending && <BlockingSpinner />}
    </div>
  );
};
