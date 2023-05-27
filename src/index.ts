import express from "express";
import cors from "cors";

import { infoReq } from "./middlewares/infoReq.middleware";
import { checkError } from "./middlewares/error.middleware";

import { friendRouter } from "./routes/friend.routes";
import { publicationRouter } from "./routes/publication.routes";
import { userRouter } from "./routes/user.routes";

import { connect } from "./db";

// --------------------------------------------------------------------------------------------

//  Función asíncrona que gestiona nuestra API.
const main = async (): Promise<void> => {
  // Conexión a la base de datos.
  const database = await connect(); //  Conectamos con la BBDD.

  //  Configuración del server.
  const PORT = 3000; //  Definimos el puerto..
  const app = express(); // Definimos el app. Lo gestionará express.
  app.use(express.json()); // Sepa interpretar los JSON
  app.use(express.urlencoded({ extended: false })); //  Sepa interpretar bien los parametros de las rutas.
  app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] })); // Utilice la libreria cors para gestionar la seguridad de acceso a la API

  // Definimos el routerHome que será el encargado de manejar las peticiones a nuestras rutas en la raíz.
  const routerHome = express.Router();

  // Endpoint de la Home de nuestra API.
  routerHome.get("/", (req, res) => {
    res.send(`Esta es la Home de nuestra API. Estamos usando la BBDD de ${database?.connection.name as string}`);
  });

  //  Para que todas las peticiones que no se correspondan con nuestras rutas den un codigo 404 y manden un mensaje de error.
  routerHome.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página requerida.");
  });

  // Middleware previo de Info de la req.
  app.use(infoReq);

  // Asignación de los routers para las diferentes rutas creadas:
  //  Usamos las rutas (el orden es importante más restrictivos a menos):
  app.use("/user", userRouter); //  Le decimos al app que utilice el userRouter importado para gestionar las rutas que tengan "/user".
  app.use("/publication", publicationRouter); //  Le decimos al app que utilice el publicationRouter importado para gestionar las rutas que tengan "/publication".
  app.use("/friend", friendRouter); //  Le decimos al app que utilice el friendRouter importado para gestionar las rutas que tengan "/friend".
  app.use("/", routerHome); //  Decimos al app que utilice el routerHome en la raíz.

  // Middleware de gestión de los Errores.
  app.use(checkError);

  // Levantamos el app en el puerto indicado:
  app.listen(PORT, () => {
    console.log(`Server levantado en puerto ${PORT}`);
  });
};

// --------------------------------------------------------------------------------------------

void main(); //  Llamamos a la función de gestión de nuestra API.
