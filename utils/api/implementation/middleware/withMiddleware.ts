//https://giancarlobuomprisco.com/next/middleware-pipes-nextjs
import { NextApiRequest, NextApiResponse } from 'next';
type Middleware = (req: NextApiRequest, res: NextApiResponse) => unknown;

/**
 * @name withMiddleware
 * @description combine multiple middleware before handling your API endpoint
 * @param middlewares
 */
export const withMiddleware = (...middlewares: Middleware[]) => {
  return async function withMiddlewareHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    async function evaluateHandler(
      middleware: Middleware,
      innerMiddleware?: Middleware
    ) {
      // return early when the request has
      // been ended by a previous middleware
      if (res.headersSent) {
        return;
      }

      try {
        if (typeof middleware === 'function') {
          const handler = await middleware(req, res);

          if (typeof handler === 'function') {
            if (innerMiddleware) {
              await handler(innerMiddleware);

              const index = middlewares.indexOf(innerMiddleware);

              // remove inner middleware
              if (index >= 0) {
                middlewares.splice(index, 1);
              }
            } else {
              await handler();
            }
          }
        }
      } catch (err) {
        console.log('here12');
        res.status(500).send('Internal server error, something went wrong');
        console.error(err);
      }
    }

    for (let index = 0; index < middlewares.length; index++) {
      const middleware = middlewares[index];
      const nextMiddleware = middlewares[index + 1];

      await evaluateHandler(middleware, nextMiddleware);
    }
  };
};
