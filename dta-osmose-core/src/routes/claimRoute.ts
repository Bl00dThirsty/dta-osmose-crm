import express from 'express';

import { createClaims, respondToClaim, getClaims, getClaimsById, deleteSingleClaim } from '../controllers/claimController';
import authorize from "../authorize";

const router = express.Router();

router.post("/:institution/claims", createClaims);
router.post("/:institution/claims/:claimId/response", respondToClaim);
router.get('/:institution/claims', getClaims);
router.get('/:id', getClaimsById);
router.get('/:id', deleteSingleClaim)


export default router;