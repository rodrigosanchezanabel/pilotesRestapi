"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.piloteRoutes = void 0;
const express_1 = require("express");
const pilote_1 = require("../model/pilote");
const database_1 = require("../database/database");
class PiloteRoutes {
    constructor() {
        this.getPilotes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield pilote_1.Pilotes.find();
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.nuevoPilotePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { identif, diametro, profundidad } = req.body;
            console.log(identif);
            const dSchema = {
                _identif: identif,
                _diametro: parseInt(diametro),
                _profundidad: parseInt(profundidad)
            };
            console.log(dSchema);
            const oSchema = new pilote_1.Pilotes(dSchema);
            yield database_1.db.conectarBD();
            yield oSchema.save()
                .then((doc) => {
                console.log('Salvado Correctamente: ' + doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.send('Error: ' + err);
            });
            yield database_1.db.desconectarBD();
        });
        this.getnCamiones = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let pilote;
            let sup = 0;
            const { identif } = req.params;
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                yield pilote_1.Pilotes.findOne({ _identif: { $eq: identif } }, (error, doc) => {
                    if (error) {
                        console.log(error);
                        res.json({ "error": "mensaje: " + error });
                    }
                    else {
                        if (doc == null) {
                            console.log('No existe');
                            res.json({});
                        }
                        else {
                            console.log('Existe: ' + doc);
                            pilote =
                                new pilote_1.Pilote(doc._identif, doc._diametro, doc._profundidad);
                            pilote.diametro = doc._diametro;
                            sup = pilote.nCamiones();
                            res.json({ "Identif": identif, "nCamiones": sup });
                        }
                    }
                });
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.getBorrar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif } = req.params;
            yield database_1.db.conectarBD();
            yield pilote_1.Pilotes.findOneAndDelete({ _identif: identif }, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    if (doc == null) {
                        console.log(`No encontrado`);
                        res.send(`No encontrado`);
                    }
                    else {
                        console.log('Borrado correcto: ' + doc);
                        res.send('Borrado correcto: ' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        this.getnCamiones2 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let arrayT = new Array();
            yield database_1.db.conectarBD();
            let tmpPilote;
            let dPilote;
            const query = yield pilote_1.Pilotes.find({});
            for (dPilote of query) {
                tmpPilote =
                    new pilote_1.Pilote(dPilote._identif, dPilote._diametro, dPilote._profundidad);
                tmpPilote.diametro = dPilote._diametro;
                const doc = {
                    identif: dPilote._identif,
                    nCamiones: tmpPilote.nCamiones()
                };
                arrayT.push(doc);
                console.log(`Pilote ${tmpPilote.identif} nCamiones: ${tmpPilote.nCamiones()}`);
            }
            console.log(arrayT);
            res.json(arrayT);
            yield database_1.db.desconectarBD();
        });
        this.actualiza = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif } = req.params;
            const { diametro, profundidad } = req.body;
            yield database_1.db.conectarBD();
            yield pilote_1.Pilotes.findOneAndUpdate({ _identif: identif }, {
                _identif: identif,
                _diametro: diametro,
                _profundidad: profundidad
            }, {
                new: true,
                runValidators: true // para que se ejecuten las validaciones del Schema
            })
                .then((docu) => {
                if (docu == null) {
                    console.log('El pilote no existe');
                    res.json({ "Error": "No existe: " + identif });
                }
                else {
                    console.log('Modificado Correctamente: ' + docu);
                    res.json(docu);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            }); // concatenando con cadena muestra mensaje
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/', this.getPilotes);
        this._router.post('/nuevoP', this.nuevoPilotePost);
        this._router.get('/nCamiones/:identif', this.getnCamiones);
        this._router.get('/nCamiones2/', this.getnCamiones2);
        this._router.get('/borrar/:identif', this.getBorrar);
        this._router.post('/actualiza/:identif', this.actualiza);
    }
}
const obj = new PiloteRoutes();
obj.misRutas();
exports.piloteRoutes = obj.router;
