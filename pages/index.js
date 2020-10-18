import React, { useEffect, useState, useContext } from "react";
import styled from "@emotion/styled";
import Layout from "../components/Layout/Layout";
import DetallesProducto from "../components/Layout/DetallesProducto";
import { FirebaseContext } from "../firebase/";
const Home = () => {
  const [productos, setProductos] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    function obtenerProductos() {
      firebase.db
        .collection("productos")
        .orderBy("creado", "desc")
        .onSnapshot(manejarSnapshot);
    }
    obtenerProductos();
  }, []);

  function manejarSnapshot(snapshot) {
    console.log(snapshot);

    const productos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    console.info(productos);
    setProductos(productos);
  }

  return (
    <div className="">
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map((producto) => (
                <DetallesProducto key={producto.id} producto={producto} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
