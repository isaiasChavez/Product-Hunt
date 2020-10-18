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
  const [comentario, setComentario] = useState({});

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
    haVotado,
  } = producto;

  const votarProducto = () => {
    console.log("Votando");
    if (!usuario) {
      return router.push("/login");
    }
    //Obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //Veriricar que no haya votado ya
    if (haVotado.includes(usuario.uid)) {
      return;
    }
    //guardar id
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //Actualizar en la BD
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

    //Actualizar State

    setProducto({
      ...producto,
      votos: nuevoTotal,
    });
  };

  //Funciones para crear comentarios
  const comentarioOnChange = (e) => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  const agregarComentario = (e) => {
    e.preventDefault();
    if (!usuario) {
      return router.push("/login");
    }

    //información extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;
    //Tomar copia de comentario

    const nuevosComentarios = [...comentarios, comentario];

    //Actualizar BD
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ comentarios: nuevosComentarios });

    //Actualizar State

    setProducto({ ...producto, comentarios: nuevosComentarios });
  };
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
                  <form action="" onSubmit={agregarComentario}>
                    <Campo>
                      <input
                        type="text"
                        name="mensaje"
                        onChange={comentarioOnChange}
                      />
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
              {comentarios.length === 0 ? (
                "Aun no hay comentarios"
              ) : (
                <ul>
                  {comentarios.map((comentario, i) => {
                    return (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 1.5rem;
                        `}
                      >
                        <p
                          css={css`
                            &: first-letter {
                              text-transform: capitalize;
                            }
                          `}
                        >
                          {comentario.mensaje}
                        </p>
                        <p
                          css={css`
                            color: rgba(0, 0, 0, 0.4);
                          `}
                        >
                          Escrito por{" "}
                          <span
                            css={css`
                              font-weight: bold;
                              text-transform: capitalize;
                            `}
                          >
                            {comentario.usuarioNombre}{" "}
                          </span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
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
