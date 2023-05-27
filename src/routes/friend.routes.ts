import express from "express";

import { Friend } from "../models/Friend";

import { checkParams } from "../middlewares/checkParams.middleware";

import { resetFriends } from "../utils/resetFriends";
// import { resetUsers } from "../utils/resetAuthors";
// import { resetPublishers } from "../utils/resetPublishers";
// import { friendGroups } from "../utils/friendRelations";

import { type Request, type Response, type NextFunction } from "express";

// Router propio de book:
export const friendRouter = express.Router();

// --------------------------------------------------------------------------------------------
// --------------------------------- ENDPOINTS DE /friend ---------------------------------------
// --------------------------------------------------------------------------------------------

/*  Endpoint para recuperar todos los friends de manera paginada en función de un limite de elementos a mostrar
por página para no saturar al navegador (CRUD: READ):
*/

friendRouter.get("/", checkParams, async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la lectura...
  try {
    // Recogemos las query params de esta manera req.query.parametro.
    const limit = req.query.limit as any;
    const page = req.query.page as any;

    const friends = await Friend.find() // Devolvemos los friends si funciona. Con modelo.find().
      .populate(["sender", "receiver"])
      .limit(limit) // La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos, coge desde el inicio a no ser que le añadamos...
      .skip((page - 1) * limit); // La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y con este cálculo podemos paginar en función del limit.

    //  Creamos una respuesta más completa con info de la API y los datos solicitados por el usuario:
    const totalElements = await Friend.countDocuments(); //  Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments()
    const totalPagesByLimit = Math.ceil(totalElements / limit); // Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.

    // Respuesta Completa:
    const response = {
      totalItems: totalElements,
      totalPages: totalPagesByLimit,
      currentPage: page,
      data: friends,
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
 http://localhost:3000/friend?limit=10&page=4 */

//  ------------------------------------------------------------------------------------------

//  Endpoint para recuperar un friend en concreto a través de su id ( modelo.findById()) (CRUD: READ):

friendRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la lectura...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const friend = await Friend.findById(id).populate(["sender", "receiver"]); //  Buscamos un friend con un id determinado dentro de nuestro modelo con modelo.findById(id a buscar).
    if (friend) {
      res.json(friend); //  Si existe el friend lo mandamos como respuesta en modo json.
    } else {
      res.status(404).json({}); //    Si no existe el friend se manda un json vacio y un código 400.
    }

    // Si falla la lectura...
  } catch (error) {
    next(error);
  }
});

// Ejemplo de REQ:
// http://localhost:3000/friend/title/titulo del libro a buscar

//  ------------------------------------------------------------------------------------------

//  Endpoint para añadir elementos (CRUD: CREATE):

friendRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la escritura...
  try {
    const friend = new Friend(req.body); //     Un nuevo friend es un nuevo modelo de la BBDD que tiene un Scheme que valida la estructura de esos datos que recoge del body de la petición.
    const createdFriend = await friend.save(); // Esperamos a que guarde el nuevo friend creado en caso de que vaya bien. Con el metodo .save().
    return res.status(201).json(createdFriend); // Devolvemos un código 201 que significa que algo se ha creado y el friend creado en modo json.

    // Si falla la escritura...
  } catch (error) {
    next(error);
  }
});

/* Petición tipo de POST para añadir un nuevo friend (añadimos al body el nuevo friend con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newFriend= {title: "Prueba title", pages: 255}
 fetch("http://localhost:3000/friend/",{"body": JSON.stringify(newFriend,"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */

//  ------------------------------------------------------------------------------------------

//  Endpoint para resetear los datos ejecutando cryptos:

friendRouter.delete("/reset", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // La constante all recoge un boleano, si recogemos una query (all) y con valor (true), esta será true:
    const all = req.query.all === "true";

    // Si all es true resetearemos todos los datos de nuestras coleciones y las relaciones entre estas.
    if (all) {
      await resetFriends();
      res.send("Datos reseteados y Relaciones reestablecidas");
    } else {
      await resetFriends();
      res.send("Datos Friendreseteados");
    }
    // Si falla el reseteo...
  } catch (error) {
    next(error);
  }
});

//  ------------------------------------------------------------------------------------------

//  Endpoint para eliminar friend identificado por id (CRUD: DELETE):

friendRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona el borrado...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const friendDeleted = await Friend.findByIdAndDelete(id); // Esperamos a que nos devuelve la info del friend eliminado que busca y elimina con el metodo findByIdAndDelete(id del friend a eliminar).
    if (friendDeleted) {
      res.json(friendDeleted); //  Devolvemos el friend eliminado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla el borrado...
  } catch (error) {
    next(error);
  }
});

/* Petición tipo DELETE para eliminar un friend  identificado por su id (no añadimos body a la busqueda y recogemos el id de los parametros de la ruta):

fetch("http://localhost:3000/friend/id del friend a borrar",{"method":"DELETE","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

//  Endpoint para actualizar un elemento identificado por id (CRUD: UPDATE):

friendRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la actualización...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const friendUpdated = await Friend.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }); // Esperamos que devuelva la info del friend actualizado al que tambien hemos pasado un objeto con los campos q tiene que acualizar en la req del body de la petición. {new: true} Le dice que nos mande el friend actualizado no el antiguo. Lo busca y elimina con el metodo findByIdAndDelete(id del friend a eliminar).
    if (friendUpdated) {
      res.json(friendUpdated); //  Devolvemos el friend actualizado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla la actualización...
  } catch (error) {
    next(error);
  }
});

/* Petición tipo de PUT para actualizar datos concretos (en este caso el title) recogidos en el body,
de un friend en concreto (recogemos el id de los parametros de la ruta ):

fetch("http://localhost:3000/friend/id del friend a actualizar",{"body": JSON.stringify({title:"El libro de las ilusiones."}),"method":"PUT","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/
