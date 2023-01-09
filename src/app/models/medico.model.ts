interface _MedicoUser {
    _id: string,
    nombre: string,
    img: string
}

interface _MedicoHospital {
    _id: string,
    nombre: string,
}

export class Medico {

    constructor(
        public nombre: string,
        public id?: string,
        public img?: string,
        public hospital?: _MedicoHospital,
        public usuario?: _MedicoUser
    ){}

}