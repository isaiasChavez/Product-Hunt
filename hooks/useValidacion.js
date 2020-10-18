import React, { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, fn) => {
  const [valores, setValores] = useState(stateInicial);

  const [errores, setErrores] = useState({});
  const [submitForm, setSubmitForm] = useState(false);

  useEffect(() => {
    if (submitForm) {
      const noErrores = Object.keys(errores).length === 0;
      if (noErrores) {
        fn(); //Función que se ejecuta el el componente
      }
      setSubmitForm(false);
    }
  }, [submitForm, errores]);

  //Función que se ejecuta cuando el usuario está escribiendo algo

  const handleChange = (e) => {
    setValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
  };

  //Función que se ejecuta cuando el usuario hace submit

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
    setSubmitForm(true);
  };
  const handleBlur = () => {
    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
  };

  return {
    valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange,
    handleBlur,
  };
};

export default useValidacion;
