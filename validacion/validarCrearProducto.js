export default function validarCrearProducto(valores) {
  let errores = {};

  //validar nombre del usuario
  if (!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }
  if (!valores.empresa) {
    errores.empresa = "La empresa es obligatoria";
  }
  if (!valores.url) {
    errores.url = "La url del producto es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "Url mal formateada";
  }
  if (!valores.descripcion) {
    errores.descripcion = "La descripcion es obligatoria";
  }
  return errores;
}
