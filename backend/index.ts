import bodyParser from "body-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import errorHandler from "./app/common/middleware/error.handler";
import { initDB } from "./app/common/services/database.services";
import { initPassport } from "./app/common/services/passport-jwt.services";
import routes from "./app/routes";
import { type IUser } from "./app/user/user.dto";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./app/swagger/swagger";


declare global {
    namespace Express {
      interface User extends Omit<IUser, "password"> { }
      interface Request {
        user?: User;
      }
    }
  }

  const port = Number(process.env.PORT) ?? 5000;

  const app: Express = express();
  app.use(express.json()); // Parses JSON bodies

  app.use(cors({
  origin: 'http://localhost:3000', // specify exact origin
  credentials: true // allow credentials
}));
  app.use(helmet()) 
  app.use(bodyParser.json());



  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(morgan("dev")); 
  const initApp = async (): Promise<void> => {
    // init mongodb
    await initDB();
  
    // passport init
    initPassport();
  
    // set base path to /api
  
    app.use("/api", routes);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  
  
    app.get("/", (req: Request, res: Response) => {
      res.send({ status: "ok" });
    });
  
    // error handler
    app.use(errorHandler);
    http.createServer(app).listen(port, () => {
      console.log("Server is runnuing on port", port);
    });
  };
  
  void initApp();