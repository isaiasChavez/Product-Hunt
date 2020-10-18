import React, { useState, useContext } from "react";
import Layout from "../components/Layout/Layout";
import Router, { useRouter } from "next/router";
import Error404 from "../components/Layout/404";
import FileUploader from "react-firebase-file-uploader";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";
import { css } from "@emotion/core";

import { FirebaseContext } from "../firebase";

//validaciones

import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";

const NuevoProducto = () => {
  const [error, setError] = useState(false);

  // state de las imagenes

  const [nombreImagen, setNombreImagen] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImagen, setUrlImagen] = useState("");

  const STATE_INICIAL = {
    nombre: "",
    empresa: "",
    imagen: "",
    url: "",
    descripcion: "",
  };
  //Operaciones crud de firebase

  const { usuario, firebase } = useContext(FirebaseContext);

  console.log(usuario);

  //Hook para redireccionar

  const router = useRouter();
  async function crearProducto() {
    //Si no está autenticado redireccionar al login
    if (!usuario) {
      return router.push("/login");
    }
    //Crear el nuevo objeto del producto

    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName,
      },
    };
    //Insertar en la base de datos
    await firebase.db.collection("productos").add(producto);
    return router.push("/");
  }

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };
  const handleProgress = (progress) => setProgreso(progress);

  const handleUploadError = (error) => {
    setSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = (filename) => {
    setUrlImagen(filename);
    setProgreso(100);
    setNombreImagen(filename);
    setSubiendo(false);
    firebase.storage
      .ref("productos")
      .child(filename)
      .getDownloadURL()
      .then((url) => {
        setUrlImagen(url);
        console.info(url);
      });
  };

  const {
    valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, url, descripcion } = valores;

  //Cuando está escribiendo y se sale

  if (!usuario) {
  }

  return (
    <div className="">
      <Layout>
        <>
          {!usuario ? (
            <Error404 />
          ) : (
            <>
              {" "}
              <h1
                css={css`
                  text-align: center;
                  margin-top: 5rem;
                `}
              >
                Nuevo Producto
              </h1>
              <Formulario action="" onSubmit={handleSubmit} noValidate>
                <fieldset>
                  <legend>Informacion general</legend>

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
                    <label htmlFor="empresa">Empresa</label>
                    <input
                      type="text"
                      id="empresa"
                      placeholder="Tu empresa"
                      name="empresa"
                      value={empresa}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Campo>
                  {errores.empresa && <Error>{errores.empresa}</Error>}

                  <Campo className="">
                    <label htmlFor="imagen">Imagen</label>
                    <FileUploader
                      id="imagen"
                      name="imagen"
                      accept="image/*"
                      randomizeFilename
                      storageRef={firebase.storage.ref("productos")}
                      onUploadStart={handleUploadStart}
                      onUploadError={handleUploadError}
                      onUploadSuccess={handleUploadSuccess}
                      onProgress={handleProgress}
                    />
                  </Campo>

                  <Campo className="">
                    <label htmlFor="url">Url</label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={url}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="URL de tu producto"
                    />
                  </Campo>
                  {errores.url && <Error>{errores.url}</Error>}
                </fieldset>
                <fieldset>
                  <legend>Sobre tu Producto</legend>
                  <Campo className="">
                    <label htmlFor="descripcion">Descripcion</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={descripcion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Campo>
                  {errores.descripcion && <Error>{errores.descripcion}</Error>}
                </fieldset>
                {error && <Error>{error}</Error>}
                <InputSubmit type="submit" value="Crear Producto" />
              </Formulario>
            </>
          )}
        </>
      </Layout>
    </div>
  );
};

export default NuevoProducto;
