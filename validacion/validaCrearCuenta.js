export default function validarCrearCuents(valores) {
  let errores = {};

  //validar nombre del usuario
  if (!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }
  if (!valores.email) {
    errores.email = "El email es obligatorio";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)) {
    errores.email = "Email no valido";
  }
  if (!valores.password) {
    errores.email = "El password es obligatorio";
  } else if (valores.password.length < 6) {
    errores.password = "Tu password debe ser de al menos 6 caracteres";
  }
  return errores;
}
