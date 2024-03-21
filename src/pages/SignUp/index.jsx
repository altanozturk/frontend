import { useEffect, useMemo, useState } from "react";
import { signUp } from "./api";
import { Input } from "./components/Input";

export function SignUp() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordRepeat, setPasswordRepeat] = useState();
  const [apiProgress, setApiProgress] = useState(false); // submit butonuna ikinci kez tıklanmaması için
  const [successMessage, setSuccessMessage] = useState();
  const [errors, setErrors] = useState({}); // obje tutuyor
  const [generalError, setGeneralError] = useState();

  // username her değiştiğinde çalışıyor
  // username her değiştiğinde setErrors objesindeki username undefined oluyor
  // ...lastErrors yapısı ile fonksiyonun içerisine giren değer kopyalanır ve username i değiştirilir
  useEffect(() => {
    setErrors(function (lastErrors) {
      return {
        ...lastErrors,
        username: undefined
      }
    });
  }, [username])

  // email her değiştiğinde çalışıyor
  // email her değiştiğinde setErrors objesindeki email undefined oluyor
  useEffect(() => {
    setErrors(function (lastErrors) {
      return {
        ...lastErrors,
        email: undefined
      }
    });
  }, [email])

  useEffect(() => {
    setErrors(function (lastErrors) {
      return {
        ...lastErrors,
        password: undefined
      }
    });
  }, [password])

  const onSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage();
    setGeneralError();
    setApiProgress(true); // submit edildiği anda true verip buton disabled koşulu fail almalı

    try {
      const response = await signUp({
        username: username,
        email: email,
        password: password,
      });
      setSuccessMessage(response.data.message);
    } catch (axiosError) {
      if (
        axiosError.response?.data &&
        axiosError.response.data.status === 400
      ) {
        setErrors(axiosError.response.data.validationErrors);
      } else {
        setGeneralError("Unexpected error occured, please try again");
      }
    } finally {
      setApiProgress(false);
    }
  };

  const passwordRepeatError = useMemo(() => {

    if(password && password !== passwordRepeat){
      console.log("always run?")
      return 'Password mismatch';
    }

    return '';

  }, [password, passwordRepeat]);
  


  return (
    <div className="container">
      <div className="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2">
        <form className="card" onSubmit={onSubmit}>
          <div className="text-center card-header">
            <h1>Sign Up</h1>
          </div>
          <div className="card-body">

            <Input
              id="username" label="Username" error={errors.username} onChange={(event) => setUsername(event.target.value)}
            />

            <Input
              id="email" label="E-mail" error={errors.email} onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              id="password" label="Password" error={errors.password} onChange={(event) => setPassword(event.target.value)} type="password"
            />

            <Input
              id="passwordRepeat" label="Password Repeat" error={passwordRepeatError} onChange={(event) => setPasswordRepeat(event.target.value)} type="password"
            />

            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}

            {generalError && (
              <div className="alert alert-danger">{generalError}</div>
            )}

            <div className="text-center">
              <button
                className="btn btn-primary"
                disabled={
                  apiProgress || !password || password !== passwordRepeat
                }
              >
                {apiProgress && (
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                )}
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
