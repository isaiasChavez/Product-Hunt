import React, { useEffect, useContext, useState } from "react";
import Error404 from "../../components/Layout/404";
import Layout from "../../components/Layout/Layout";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { FirebaseContext } from "../../firebase";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";
const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const Producto = () => {
  //state del componente
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);

  //Routing para obtener el id actual
  const router = useRouter();

  const {
    query: { id },
  } = router;
  //Importar contexto de firebase con la autenticación

  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();

        if (producto.exists) {
          console.log(producto.data());
          setProducto(producto.data());
        } else {
          setError(true);
          console.log("No existe");
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0) return "Cargando ";

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlImagen,
    votos,
    creador,
  } = producto;

  const votarProducto = () => {};

  return (
    <Layout>
      <>
        {error && <Error404 />}

        <div className="contenedor">
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            {nombre}
          </h1>
          <ContenedorProducto className="">
            <div>
              <p>
                {" "}
                Publicado hace{" "}
                {formatDistanceToNow(new Date(creado), { locale: es })}
              </p>
              <p>
                Publicado por: {creador.nombre} de {empresa}
              </p>
              <img src={urlImagen} alt="" />
              <p>{descripcion}</p>

              {usuario && (
                <>
                  <h2>Agrega tu comentario</h2>
                  <form action="">
                    <Campo>
                      <input type="text" name="mensaje" />
                    </Campo>
                    <InputSubmit type="submit" value="Agregar comentario" />
                  </form>
                </>
              )}
              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >
                Comentarios
              </h2>

              {comentarios.map((comentario) => {
                <li>
                  <p>{comentario.nombre}</p>
                  <p>Escrito por {comentario.usuarioNombre}</p>
                </li>;
              })}
            </div>
            <aside>
              <Boton target="_blank" href={url} bgColor={true}>
                Visitar URL
              </Boton>

              <div
                css={css`
                  margin-top: 5rem;
                `}
              >
                <p
                  css={css`
                    text-align: center;
                  `}
                >
                  {votos} Votos
                </p>
              </div>
              {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
            </aside>
          </ContenedorProducto>
        </div>
      </>
    </Layout>
  );
};

export default Producto;
