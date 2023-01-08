import { environment } from "src/environments/environment";

const { base_url } = environment

export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public google?: boolean,
        public img?: string,
        public role?: string,
        public uid?: string,
    ) {}
    
    get imagenUrl(): string{
        if(this.google) return this.img;

        if(this.img) return `${base_url}/uploads/usuarios/${this.img}`; 

        return `${base_url}/uploads/usuarios/no-img.jpg`; ;
    }
}