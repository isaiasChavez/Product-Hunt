import React from "react";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";

import Link from "next/link";
const Producto = styled.li`
  padding: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e1e1;
`;
const DescripcionProducto = styled.div`
  flex: 0 1 600px;
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 2rem;
`;

const Imagen = styled.img`
  width: 200px;
`;

const Comentarios = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e1e1e1;
    padding: 0.3rem 1rem;
    margin-right: 2rem;
    & > img {
      width: 2rem;
      height: 2rem;
      overflow: hidden;
      margin-right: 2rem;
    }
  }

  p {
    font-size: 1.6rem;
    margin-right: 1rem;
    font-weight: 700;
    &:last-of-type {
      margin: 0;
    }
  }
`;

const Titulo = styled.a`
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  :hover {
    cursor: pointer;
  }
`;
const Descripcion = styled.p`
  font-size: 1.6rem;
  margin: 0;
  color: #888;
`;

const Votos = styled.div`
  flex: 0 0 auto;
  text-align: center;
  border: 1px solid #e1e1e1;
  padding: 1rem 3rem;

  div {
    font-size: 2rem;
  }
  p {
    margin: 0;
    font-size: 3rem;
    font-weight: 700;
  }
`;

const DetallesProducto = ({ producto }) => {
  console.log(producto);

  const {
    id,
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlImagen,
    votos,
  } = producto;
  return (
    <Producto>
      <DescripcionProducto className="">
        <div className="">
          <Imagen src={urlImagen} alt="" />
        </div>
        <div className="">
          <Link href="/productos/[id]" as={`/productos/${id}`}>
            <Titulo>{nombre}</Titulo>
          </Link>
          <Descripcion>{descripcion}</Descripcion>
          <Comentarios>
            <div>
              <img src={"/static/img/comentario.png"} alt="" />
              <p>{comentarios.length} comentarios</p>
            </div>
          </Comentarios>
          <div className="">
            Publicado hace{" "}
            {formatDistanceToNow(new Date(creado), { locale: es })}
          </div>
        </div>
      </DescripcionProducto>
      <Votos className="">
        <div className=""> &#9650;</div>
        <p>{votos}</p>
      </Votos>
    </Producto>
  );
};

export default DetallesProducto;
