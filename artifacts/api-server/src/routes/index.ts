import { Router, type IRouter } from "express";
import healthRouter from "./health";
import customerCareRouter from "./customer-care";

const router: IRouter = Router();

router.use(healthRouter);
router.use(customerCareRouter);

export default router;
