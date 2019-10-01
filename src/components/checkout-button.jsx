import React, { Fragment } from 'react';
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'

const CheckoutButton = () => {
  const cartImage = 'data:image/jpeg;base64,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'
  const publishableKey = 'pk_test_nQ69lCMREB0gJmkKTShfVflx00ukO973J5';
  const onToken = token => {
    const body = {
      amount: 999,
      token
    }
    axios
      .post("http://localhost:8000/api/payment", body)
      .then(response => {
        console.log('Response:  ', response)
        alert('Payment success')
      })
      .catch(error => {
        console.error('Payment Error:  ', error)
        alert('Payment error')
      })
  }

  return (
    <StripeCheckout
      label='Confirm'
      name='My Business'
      description='Make a payment now'
      panelLabel='Confirm payment'
      amount={999}
      token={onToken}
      stripeKey={publishableKey}
      image={cartImage}
      billingAddress={false}
    />
  )
}

export default CheckoutButton

