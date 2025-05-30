import { type BaseSchema } from "../common/dto/base.dto";

export interface IService extends BaseSchema {
  name: string;
  pricePerCall: number;
  endpoint: string;
  description?: string;
  active: boolean;

}

export interface IServiceStats extends BaseSchema {
  user: string;
  service: string;
  hitCount: number;
}