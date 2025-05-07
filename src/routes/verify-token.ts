import { Router, Response, Request } from 'express'
import { TokenAuthorization } from '../middleware/token-authorization';

const VerifyTokenRouter = Router();

VerifyTokenRouter.get("/", TokenAuthorization, (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Token is valid' });
})

export default VerifyTokenRouter;