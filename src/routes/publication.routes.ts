import express from "express";

import { Publication } from "../models/Publication";

import { checkParams } from "../middlewares/checkParams.middleware";

import { resetPublications } from "../utils/resetPublications";

import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

// Router propio de publication:
export const publicationRouter = express.Router();

// --------------------------------------------------------------------------------------------
// ------------------------------ ENDPOINTS DE /publication -------------------------------------
// --------------------------------------------------------------------------------------------

/*  Endpoint para recuperar todos los publications de manera paginada en función de un limite de elementos a mostrar
por página para no saturar al navegador (CRUD: READ):
*/

publicationRouter.get("/", checkParams, async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la lectura...
  try {
    // Recogemos las query params de esta manera req.query.parametro.
    const limit = req.query.limit as any;
    const page = req.query.page as any;

    const publications = await Publication.find().populate("owner") // Devolvemos los publications si funciona. Con modelo.find().
      .limit(limit) // La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos, coge desde el inicio a no ser que le añadamos...
      .skip((page - 1) * limit); // La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y con este cálculo podemos paginar en función del limit. // Con populate le indicamos que si recoge un id en la propiedad señalada rellene con los campos de datos que contenga ese id
    //  Creamos una respuesta más completa con info de la API y los datos solicitados por el publication:
    const totalElements = await Publication.countDocuments(); //  Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments()
    const totalPagesByLimit = Math.ceil(totalElements / limit); // Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.

    // Respuesta Completa:
    const response = {
      totalItems: totalElements,
      totalPages: totalPagesByLimit,
      currentPage: page,
      data: publications,
    };
    // Enviamos la respuesta como un json.
    res.json(response);

    // Si falla la lectura...
  } catch (error) {
    next(error);
  }
});

/* Ejemplo de REQ indicando que queremos la página 4 estableciendo un limite de 10 elementos
 por página (limit = 10 , pages = 4):
 http://localhost:3000/publication?limit=10&page=4 */

//  ------------------------------------------------------------------------------------------

//  Endpoint para recuperar un publication en concreto a través de su id ( modelo.findById()) (CRUD: READ):

publicationRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la lectura...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const publication = await Publication.findById(id).populate("owner"); //  Buscamos un documentos con un id determinado dentro de nuestro modelo con modelo.findById(id a buscar).
    if (publication) {
      res.json(publication); //  Si existe el publication lo mandamos como respuesta en modo json.
    } else {
      res.status(404).json({}); //    Si no existe el publication se manda un json vacio y un código 400.
    }

    // Si falla la lectura...
  } catch (error) {
    next(error);
  }
});

// Ejemplo de REQ:
// http://localhost:3000/publication/id del publication a buscar

//  ------------------------------------------------------------------------------------------

//  Endpoint para añadir elementos (CRUD: CREATE):

publicationRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la escritura...
  try {
    const publication = new Publication(req.body); //     Un nuevo publication es un nuevo modelo de la BBDD que tiene un Scheme que valida la estructura de esos datos que recoge del body de la petición.
    const createdPublication = await publication.save(); // Esperamos a que guarde el nuevo publication creado en caso de que vaya bien. Con el metodo .save().
    return res.status(201).json(createdPublication); // Devolvemos un código 201 que significa que algo se ha creado y el publication creado en modo json.

    // Si falla la escritura...
  } catch (error) {
    next(error);
  }
});

/* Petición tipo de POST para añadir un nuevo publication (añadimos al body el nuevo publication con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newPublication = {name: "Prueba Nombre", country: "Prueba country"}
 fetch("http://localhost:3000/publication/",{"body": JSON.stringify(newPublication),"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */
//  ------------------------------------------------------------------------------------------

//  Endpoint para resetear los datos de publication:

publicationRouter.delete("/reset", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona el reseteo...
  try {
    await resetPublications();
    res.send("Datos Publication reseteados");

    // Si falla el reseteo...
  } catch (error) {
    next(error);
  }
});

//  ------------------------------------------------------------------------------------------

//  Endpoint para eliminar publication identificado por id (CRUD: DELETE):

publicationRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona el borrado...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const publicationDeleted = await Publication.findByIdAndDelete(id); // Esperamos a que nos devuelve la info del publication eliminado que busca y elimina con el metodo findByIdAndDelete(id del publication a eliminar).
    if (publicationDeleted) {
      res.json(publicationDeleted); //  Devolvemos el publication eliminado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla el borrado...
  } catch (error) {
    next(error);
  }
});

/* Petición tipo DELETE para eliminar un publication (no añadimos body a la busqueda y recogemos el id de los parametros de la ruta) identificado por su id:

fetch("http://localhost:3000/publication/id del publication a borrar",{"method":"DELETE","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

//  Endpoin para actualizar un elemento identificado por id (CRUD: UPDATE):

publicationRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la actualización...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const publicationUpdated = await Publication.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }); // Esperamos que devuelva la info del publication actualizado al que tambien hemos pasado un objeto con los campos q tiene que acualizar en la req del body de la petición. {new: true} Le dice que nos mande el publication actualizado no el antiguo. Lo busca y elimina con el metodo findByIdAndDelete(id del publication a eliminar).
    if (publicationUpdated) {
      res.json(publicationUpdated); //  Devolvemos el publication actualizado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla la actualización...
  } catch (error) {
    next(error);
  }
});

/* Petición tipo de PUT para actualizar datos concretos (en este caso el tlf) recogidos en el body,
de un publication en concreto (recogemos el id de los parametros de la ruta ):

fetch("http://localhost:3000/publication/id del publication a actualizar",{"body": JSON.stringify({country: "Prueba country"}),"method":"PUT","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/
