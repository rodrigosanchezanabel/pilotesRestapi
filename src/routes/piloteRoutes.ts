import {Request, Response, Router } from 'express'
import { Pilotes, Pilote, tPilote } from '../model/pilote'
import { db } from '../database/database'

class PiloteRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getPilotes = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Pilotes.find()
            console.log(query)
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        db.desconectarBD()
    }
  
    private nuevoPilotePost = async (req: Request, res: Response) => {
        console.log(req.body)
        const { identif, diametro, profundidad } = req.body

        console.log(identif)

        const dSchema = {
            _identif: identif,
            _diametro: parseInt(diametro),
            _profundidad: parseInt(profundidad)
        }
        console.log(dSchema)
        const oSchema = new Pilotes(dSchema)
        await db.conectarBD()
        await oSchema.save()
        .then( (doc) => {
            console.log('Salvado Correctamente: '+ doc)
            res.json(doc)
        })
        .catch( (err: any) => {
            console.log('Error: '+ err)
            res.send('Error: '+ err)
        }) 
        await db.desconectarBD()
    }     

    private getnCamiones = async (req: Request, res: Response) => {
        let pilote: Pilote
        let sup: number = 0
        const { identif } = req.params
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            await Pilotes.findOne({_identif: {$eq: identif}},
                (error, doc: any) => {
                    if(error) {
                        console.log(error)
                        res.json({"error": "mensaje: "+error})
                    }else{
                        if (doc == null) {
                            console.log('No existe')
                            res.json({})
                        }else {
                            console.log('Existe: '+ doc)
                            pilote = 
                                new Pilote(doc._identif, doc._diametro, 
                                    doc._profundidad)
                            pilote.diametro = doc._diametro  
                            sup = pilote.nCamiones()
                            res.json({"Identif": identif, "nCamiones": sup})
                        }
                    }
                }
            )

        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        db.desconectarBD()
    }

    private getBorrar = async (req: Request, res: Response) => {
        const {identif } = req.params
        await db.conectarBD()
        await Pilotes.findOneAndDelete(
            { _identif: identif }, 
            (err: any, doc) => {
                if(err) console.log(err)
                else{
                    if (doc == null) {
                        console.log(`No encontrado`)
                        res.send(`No encontrado`)
                    }else {
                        console.log('Borrado correcto: '+ doc)
                        res.send('Borrado correcto: '+ doc)
                    }
                }
            })
        db.desconectarBD()
    }

    private getnCamiones2 =  async (req: Request, res: Response) => {
        type tDoc = {
            identif: String,
            nCamiones: number
        }
        let arrayT: Array<tDoc> = new Array<tDoc>()
        await db.conectarBD()
        let tmpPilote: Pilote
        let dPilote: any 
        const query =  await Pilotes.find( {} )
        for (dPilote of query){
            tmpPilote = 
                new Pilote(dPilote._identif, dPilote._diametro, 
                        dPilote._profundidad)
            tmpPilote.diametro = dPilote._diametro 
            const doc = {
                identif:  dPilote._identif,
                nCamiones: tmpPilote.nCamiones()
            }
            arrayT.push(doc)


            console.log(`Pilote ${tmpPilote.identif} nCamiones: ${tmpPilote.nCamiones()}`)

        }
        console.log(arrayT)
        res.json(arrayT)
        await db.desconectarBD()   
    }
    private actualiza = async (req: Request, res: Response) => {
        const { identif }= req.params
        const { diametro ,profundidad } = req.body
        await db.conectarBD()
        await Pilotes.findOneAndUpdate(
                { _identif: identif }, 
                {
                    _identif: identif,
                    _diametro: diametro,
                    _profundidad: profundidad
                },
                {
                    new: true,
                    runValidators: true // para que se ejecuten las validaciones del Schema
                }  
            )
            .then( (docu) => {
                if (docu==null){
                    console.log('El pilote no existe')
                    res.json({"Error":"No existe: "+identif})
                } else {
                    console.log('Modificado Correctamente: '+ docu) 
                    res.json(docu)
                }
                
            }
        )
        .catch( (err) => {
            console.log('Error: '+err)
            res.json({error: 'Error: '+err })
        }
        ) // concatenando con cadena muestra mensaje
    db.desconectarBD()
}

    misRutas(){
        this._router.get('/', this.getPilotes)
        this._router.post('/nuevoP', this.nuevoPilotePost)
        this._router.get('/nCamiones/:identif', this.getnCamiones)
        this._router.get('/nCamiones2/', this.getnCamiones2)
        this._router.get('/borrar/:identif', this.getBorrar)
        this._router.post('/actualiza/:identif', this.actualiza)
    }
}

const obj = new PiloteRoutes()
obj.misRutas()
export const piloteRoutes = obj.router
