import { type IService } from "../service/service.dto";
import { type IUser } from "../user/user.dto";
import { type IApikey } from "../apikey/apikey.dto";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      service?: IService;
      apiKey?: IApikey;
    }
  }
} 