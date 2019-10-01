const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const stripeChargeCallback = res => (error, response) => {
  if(error) res.status(500).send({error})
  else res.status(200).send({success: response})
}

router.get('/', (req, res, err) => {
  console.log('getting checkout server')
  if(err) {
    console.error(err)
  }
  res.send({
    message: 'Hello Stripe checkout server!',
    timestamp: new Date().toISOString()
  })
})

router.post('/', (req, res) => {
  console.log('req body:  ', req.body)
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: 'usd'
  }
  stripe.charges.create(body, stripeChargeCallback(res))
})

module.exports = router