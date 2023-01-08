import { Usuario } from '../models'

export interface PaginadoUsuarios {
    total: number,
    usuarios: Usuario[]
}