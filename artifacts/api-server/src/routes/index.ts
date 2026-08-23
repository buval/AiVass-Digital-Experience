import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import webhookRouter from "./webhook.js";
import downloadRouter from "./downloads.js";
import orderRouter from "./order.js";
import myDownloadsRouter from "./my-downloads.js";
import checkoutRouter from "./checkout.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/webhooks", webhookRouter);
router.use("/download", downloadRouter);
router.use("/my-downloads", myDownloadsRouter);
router.use(checkoutRouter);
router.use(orderRouter);

export default router;
