import Swal from "sweetalert2";

import { ACEPTAR, CANCELAR, ERROR, EXITO, EXITO_SUBTEXTO, SEGURO, SEGURO_SUBTEXTO } from "./mensajes";

export const swalConfirm = (mensaje: string = '') => Swal.fire({
    title: SEGURO,
    text: mensaje || SEGURO_SUBTEXTO,
    icon: 'question',
    showCancelButton: true,
    cancelButtonText: CANCELAR,
    showConfirmButton: true,
    confirmButtonText: ACEPTAR
});

export const swalSuccess = (mensaje: string = '') => Swal.fire({
    title: EXITO,
    text: mensaje || EXITO_SUBTEXTO,
    icon: 'success'
})

export const swalError = (mensaje: string = '') => Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || ERROR
});