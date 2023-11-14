import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import showNotification from "@/helpers/show_notification";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = ({
  amt,
  donorName,
  donationMessage,
  customAmount,
  amountFromCheckbox,
  donorEmail,
  donorPhone,
  donorAddress,
  donorGiftNote,
  toggle,
  settoggle,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [amount, setAmount] = useState("");
  const formData = new FormData();
  formData.append("donorName", donorName);
  formData.append("donationMessage", donationMessage);
  formData.append("amt", amt);
  formData.append("donorEmail", donorEmail);
  formData.append("donorPhone", donorPhone);
  formData.append("donorAddress", donorAddress);
  formData.append("donorGiftNote", donorGiftNote);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const paymentMethodResult = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (paymentMethodResult.error) {
      setErrorMessage(paymentMethodResult.error.message);
      return;
    }

    // Create or confirm the payment intent on the server
    const res = await fetch(
      "https://nextupgrad.us/laravel-old/diligent-api/api/order/pay",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethodResult.paymentMethod.id,
         // paymentAmount: amount,
          paymentAmount: amt,
          returnUrl: "https://localhost:3000", // Specify your frontend return URL here
        }),
      }
    );

    const result = await res.json();
    const clientSecret = result.clientSecret;

    const { error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: paymentMethodResult.paymentMethod.id,
      }
    );

    if (confirmError) {
      setErrorMessage(confirmError.message);
    } else {
      console.log("Payment successful");
      try {
        // send data to backend after successful payment
        const res = await fetch(
          "https://nextupgrad.us/laravel-old/diligent-api/api/doPayment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              formData,
            }),
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div>
        {/* <label>Amount: {amt}</label> */}
        {/* <input
          type="text"
          value={amt}
          onChange={(e) => setAmount(e.target.value)}
        /> */}
      </div>
      <CardElement />
      <button className="payBtn" onClick={handleSubmit} type="button" disabled={!stripe || !elements}>
        Pay Now
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

const stripePromise = loadStripe(
  "pk_live_51NWr6bKALw1Ok2lyX9i6ej8x7GtWJayseuSkE79V39hhwH3DqK0kh7wCIgIQVYiLOcZtcaTF9KaKrs2DROeBYvaa00C9QMmuup"
);

const StripePay = ({
  amt,
  donorName,
  donationMessage,
  customAmount,
  amountFromCheckbox,
  donorEmail,
  donorPhone,
  donorAddress,
  donorGiftNote,
  toggle,
  settoggle,
}) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm
      amt={amt}
      donationMessage={donationMessage}
      customAmount={customAmount}
      amountFromCheckbox={amountFromCheckbox}
      donorName={donorName}
      donorEmail={donorEmail}
      donorPhone={donorPhone}
      donorAddress={donorAddress}
      donorGiftNote={donorGiftNote}
      toggle={toggle}
      settoggle={settoggle}
    />
  </Elements>
);

export default StripePay;
