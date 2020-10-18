import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import Router from "next/router";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";
import { css } from "@emotion/core";

import firebase from "../firebase";

//validaciones

import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSesion";

const Login = () => {
  const [error, setError] = useState(false);
  const STATE_INICIAL = {
    email: "",
    password: "",
  };
  async function crearCuenta() {
    try {
      const usuario = await firebase.login(email, password);
      console.log(usuario);
      Router.push("/");
    } catch (error) {
      console.error(
        error,
        error.message,
        "Hubo un error al ingresar el usuario"
      );
      setError(error.message);
    }
  }

  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, crearCuenta);

  const { email, password } = valores;

  //Cuando está escribiendo y se sale

  return (
    <div className="">
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Iniciar Sesion
          </h1>
          <Formulario action="" onSubmit={handleSubmit} noValidate>
            <Campo className="">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Tu email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo className="">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Tu password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Iniciar Sesión" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default Login;
