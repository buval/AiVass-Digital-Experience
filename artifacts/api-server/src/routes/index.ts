import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import webhookRouter from "./webhook.js";
import downloadRouter from "./downloads.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/webhooks", webhookRouter);
router.use("/download", downloadRouter);

export default router;
