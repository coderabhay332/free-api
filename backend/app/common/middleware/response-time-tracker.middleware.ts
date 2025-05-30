import { type Request, type Response, type NextFunction } from "express";
import { ServiceStatsSchema } from "../../service/service.schema";

export const trackResponseTime = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, callback?: any) {
    const responseTime = Date.now() - startTime;
    
    res.setHeader('X-Response-Time', responseTime.toString());
    res.locals.responseTime = responseTime;
    console.log("responseTime", responseTime);

    if (req.user && req.service) {
      void (async () => {
        try {
          const currentHit = await ServiceStatsSchema.findOne({ 
            user: req.user?._id, 
            service: req.service._id 
          });
          
          if (currentHit) {
            currentHit.hitCount++;
            currentHit.lastHit = new Date();
            currentHit.hitHistory.push({
              timestamp: new Date(),
              responseTime,
              status: 'SUCCESS'
            });
            await currentHit.save();
          } else {
            await ServiceStatsSchema.create({ 
              user: req.user?._id, 
              service: req.service._id, 
              hitCount: 1,
              lastHit: new Date(),
              hitHistory: [{
                timestamp: new Date(),
                responseTime,
                status: 'SUCCESS'
              }]
            });
          }
        } catch (error) {
          console.error('Error saving service stats:', error);
        }
      })();
    }

    return originalEnd.call(this, chunk, encoding, callback);
  };

  next();
}; 