import express from "express"
import {isAuthenticated} from "..//middlewares/auth.js"
import {buySubscription,paymentVerification,getRazorPayKey,cancelSubscription} from "../controllers/paymentController.js"

const router = express.Router();


//Buy Subscription
router.route("/subscribe").get(isAuthenticated,buySubscription)

// verify payemnt and save  refernce in database
router.route("/paymentverification").post(isAuthenticated,paymentVerification)

// get razorpay key
router.route("/razorpaykey").get(getRazorPayKey)

//cancel subscription
router.route("/subscribe/cancel").delete(isAuthenticated,cancelSubscription)

export default router;