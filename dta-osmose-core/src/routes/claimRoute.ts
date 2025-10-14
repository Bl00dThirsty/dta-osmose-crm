import express from 'express';

import { createClaims, respondToClaim, getClaims, 
getClaimsById, deleteSingleClaim, updateClaimResponse, getPendingClaims } from '../controllers/claimController';
import authorize from "../authorize";

const router = express.Router();

router.post("/:institution/claims", authorize("create-claim"),createClaims);
router.post("/:institution/claims/:claimId/response", authorize("create-claimResponse"), respondToClaim);
router.get('/:institution/claims', authorize("readAll-claim"), getClaims);
router.get("/:institution/pendingClaim", authorize("view-pendingClaim"), getPendingClaims)
router.get('/:id', authorize("view-Claim"), getClaimsById);
router.put("/response/:responseId", authorize("update-claimResponse"), updateClaimResponse);
router.delete('/:id', authorize("delete-claim"), deleteSingleClaim)


export default router;