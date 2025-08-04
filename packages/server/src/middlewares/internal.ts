import { Request, Response, NextFunction } from 'express';
import { createResponse } from '../utils/responses';
import { constants, Env } from '@aiostreams/core';

export const internalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const internalSecret = req.get(constants.INTERNAL_SECRET_HEADER);
  if (internalSecret !== Env.INTERNAL_SECRET) {
    res.status(403).json(
      createResponse({
        success: false,
        detail: 'Forbidden',
      })
    );
    return;
  }

  next();
};
