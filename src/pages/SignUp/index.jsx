import axios from "axios";
import { useEffect, useState } from "react";
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
  // username her değiştiğinde setErrors objesi boşaltılıyor
  useEffect(() => {
    setErrors({});
  }, [username]);

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

  return (
    <div className="container">
      <div className="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2">
        <form className="card" onSubmit={onSubmit}>
          <div className="text-center card-header">
            <h1>Sign Up</h1>
          </div>
          <div className="card-body">
            <Input
              id="username"
              label="Username"
              error={errors.username}
              onChange={(event) => setUsername(event.target.value)}
            />
            {/* <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username{" "}
              </label>
              <input
                id="username"
                className={
                  errors.username ? "form-control is-invalid" : "form-control"
                }
                onChange={(event) => setUsername(event.target.value)}
              ></input>
              <div className="invalid-feedback">{errors.username}</div>
            </div> */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail{" "}
              </label>
              <input
                id="email"
                className={
                  errors.email ? "form-control is-invalid" : "form-control"
                }
                onChange={(event) => setEmail(event.target.value)}
              ></input>
              <div className="invalid-feedback">{errors.email}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password{" "}
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                onChange={(event) => setPassword(event.target.value)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="passwordRepeat" className="form-label">
                Password Repeat{" "}
              </label>
              <input
                id="passwordRepeat"
                type="password"
                className="form-control"
                onChange={(event) => setPasswordRepeat(event.target.value)}
              ></input>
            </div>

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
