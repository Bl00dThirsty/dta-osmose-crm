import express from 'express';

import { createClaims, respondToClaim, getClaims } from '../controllers/claimController';
import authorize from "../authorize";

const router = express.Router();

router.post("/:institution/claims", createClaims);
router.post("/:institution/claims/:claimId/response", respondToClaim);
router.get('/:institution/claims', getClaims);


export default router;