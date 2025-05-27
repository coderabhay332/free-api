import { type BaseSchema } from "../common/dto/base.dto";

export interface IService extends BaseSchema {
  name: string;
  pricePerCall: number;
  endpoint: string;
  description?: string;
  active: boolean;
  hitStats: {
    user: string;
    hitCount: number;
  }[];
}
