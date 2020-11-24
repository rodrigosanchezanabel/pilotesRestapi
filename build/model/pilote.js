"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pilotes = exports.Pilote = void 0;
const mongoose_1 = require("mongoose");
class Pilote {
    constructor(identif, diametro, profundidad) {
        this._identif = identif;
        this._diametro = diametro;
        this._profundidad = profundidad;
        //    this._altura = altura
    }
    get identif() {
        return this._identif;
    }
    get diametro() {
        return this._diametro;
    }
    get profundidad() {
        return this._profundidad;
    }
    set diametro(_diametro) {
        if (_diametro < 0) {
            throw "El diámetro debe ser > 0";
        }
        this._diametro = _diametro;
    }
    set profundidad(_profundidad) {
        if (_profundidad < 0) {
            throw "El diámetro debe ser > 0";
        }
        this._profundidad = _profundidad;
    }
    tierra() {
        let tierra;
        tierra = ((((((this._diametro / 2) * (this._diametro / 2)) * 3.1416) * this._profundidad) * 1.15) / 1000000000);
        if (tierra == 0) {
            throw "ERROR: No se ha echado hormigón, inténtelo de nuevo";
        }
        return Math.round(tierra);
    }
    /* 1,15 es el esponjamiento de la tierra extraida */
    hormigon() {
        let hormigon;
        hormigon = (((((this._diametro / 2) * (this._diametro / 2)) * 3.1416) * this._profundidad) / 1000000000);
        if (hormigon == 0) {
            throw "ERROR: No se ha echado hormigón, inténtelo de nuevo";
        }
        return Math.round(hormigon);
    }
    hierro() {
        let hierro;
        hierro = 15 * this._profundidad;
        if (hierro == 0) {
            throw "ERROR: Sin hierro el pilote se cae, inténtelo de nuevo";
        }
        return hierro;
    }
    /* 15 son los kg aplicables a metro lineal de pilote */
    nCamiones() {
        let nCamiones;
        nCamiones = ((((((this._diametro / 2) * (this._diametro / 2)) * 3.1416) * this._profundidad) * 1.15) / 1000000000) / 6;
        if (nCamiones == 0) {
            throw "ERROR: No se ha echado hormigón, inténtelo de nuevo";
        }
        return Math.round(nCamiones);
    }
}
exports.Pilote = Pilote;
// Definimos el Schema
const piloteSchema = new mongoose_1.Schema({
    _identif: {
        type: String,
        unique: true // useCreateIndex: true en la conexión para que se cree el índice único
    },
    _diametro: {
        type: Number,
        min: 300
    },
    _profundidad: {
        type: Number,
        max: 20000
    },
});
// El nombre de la colección se pone en plural
exports.Pilotes = mongoose_1.model('pilotes', piloteSchema);
