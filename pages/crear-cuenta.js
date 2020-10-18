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
import validarCrearCuenta from "../validacion/validaCrearCuenta";
const CrearCuenta = () => {
  const [error, setError] = useState(false);
  const STATE_INICIAL = {
    nombre: "",
    email: "",
    password: "",
  };
  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push("/");
    } catch (error) {
      console.error(error, error.message, "Hubo un error al crear el usuario");
      setError(error.message);
    }
  }

  const {
    valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { email, nombre, password } = valores;

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
            Crear Cuenta
          </h1>
          <Formulario action="" onSubmit={handleSubmit} noValidate>
            <Campo className="">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}
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
            <InputSubmit type="submit" value="Crear Cuenta" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default CrearCuenta;
