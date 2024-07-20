// service1/src/routes/index.ts
import { Router } from "express";
import { archiveSearchParamsValidator } from "../middlewares/paramsValidatorMiddleware";
import { prepareArchiveRequestMiddleware } from "../middlewares/prepareRequestMiddleware";
import { archiveSearch } from "../controllers/archive";

const router = Router();

const ARCHIVE_BASE_URL = "/catalog";

router.post(
  ARCHIVE_BASE_URL + "/search",
  archiveSearchParamsValidator,
  prepareArchiveRequestMiddleware,
  archiveSearch
);

export default router;
