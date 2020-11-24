import {Schema, model } from 'mongoose'

export class Pilote{
    private _identif: string
    private _diametro: number
    private _profundidad: number
    
    constructor(identif: string, diametro : number, profundidad : number){
        this._identif = identif
        this._diametro = diametro
        this._profundidad = profundidad
        
    //    this._altura = altura
    }
    get identif(){
        return this._identif
    }

    get diametro(){
        return this._diametro
    }

    get profundidad(){
        return this._profundidad
    }

    set diametro(_diametro: number){
        
        if (_diametro < 0){
            throw "El diámetro debe ser > 0"
        }
        this._diametro = _diametro
    }

    set profundidad(_profundidad: number){
       
        if (_profundidad < 0){
            throw "El diámetro debe ser > 0"
        }
        this._profundidad = _profundidad
    }
    
    tierra(){
        let tierra : number
        tierra =((((((this._diametro/2)*(this._diametro/2))*3.1416)*this._profundidad)*1.15)/1000000000)
        if (tierra == 0){
            throw "ERROR: No se ha echado hormigón, inténtelo de nuevo"
        }
        return Math.round(tierra)
    }

    /* 1,15 es el esponjamiento de la tierra extraida */

    hormigon(){
        let hormigon: number
        hormigon =(((((this._diametro/2)*(this._diametro/2))*3.1416)*this._profundidad)/1000000000)
        if (hormigon == 0){
            throw "ERROR: No se ha echado hormigón, inténtelo de nuevo"
        }
        return Math.round(hormigon)
    }

    hierro(){
        let hierro: number
        hierro =15 * this._profundidad   
        if (hierro == 0){
            throw "ERROR: Sin hierro el pilote se cae, inténtelo de nuevo"
        }
        return hierro
    }

    /* 15 son los kg aplicables a metro lineal de pilote */

    nCamiones(){
        let nCamiones:number
        nCamiones =((((((this._diametro/2)*(this._diametro/2))*3.1416)*this._profundidad)*1.15)/1000000000)/6
        if (nCamiones == 0){
            throw "ERROR: No se ha echado hormigón, inténtelo de nuevo"
        }
        return Math.round(nCamiones)
    }
}

// Definimos el type

export type tPilote = {
    _identif: string,
    _diametro: number,
    _profundidad: number,
}

// Definimos el Schema
const piloteSchema = new Schema({
    _identif: {
        type: String,
        unique: true  // useCreateIndex: true en la conexión para que se cree el índice único
    },
    _diametro: {
        type: Number,
        min: 300
    },
    _profundidad: {
        type: Number,
        max: 20000
    },
})

// El nombre de la colección se pone en plural

export const Pilotes = model('pilotes',piloteSchema)