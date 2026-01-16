import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addIncome, deleteIncome, getIncome ,updateIncome} from "../controllers/incomeController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addIncome);
router.get("/", getIncome);
router.delete("/:id", deleteIncome);
router.put("/:id",updateIncome)

export default router;
