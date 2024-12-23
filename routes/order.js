const express = require('express')
const router = express.Router()
const {paymentModel} = require('../models/paymentSchema')
const {orderModel} = require('../models/orderSchema')
router.get('/:userid/:orderid/:paymentid/:signature' ,async  function(req , res){

let paymentDetails = await paymentModel.findOne({
    orderId : req.params.orderid
})
if(!paymentDetails) return res.send("Payment  not completed")

    if(req.params.signature === paymentDetails.signature &&  req.params.paymentid === paymentDetails.paymentId){
        let cart = await cartModel.findOne({user : req.params.userid})
       await  orderModel.create({
            orderid : req.params.orderid,
            user : req.params.userid,
            products : cart.products,
            totalPrice : cart.totalPrice,
            status : "processing",
            payment : paymentDetails._id,

        })
        res.redirect(`/map/${req.params.orderid}`);

    }
    else{
        res.send("Invalid Payment")
    }
})

router.post('/address/:orderid' ,async  function(req , res){
let order =await orderModel.findOne({orderId : req.params.orderid})
if(!order) return res.send('Sorry , This Order does not Exist')
    if(!req.body.address) return res.send("You Must Provide an Addres");
order.address = req.body.address;
order.save();
res.redirect("/")

})

module.exports = router