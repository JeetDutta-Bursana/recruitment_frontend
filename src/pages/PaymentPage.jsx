// src/pages/PaymentPage.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId, userId, job } = location.state || {};

  const [step, setStep] = useState("method");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!jobId || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Invalid navigation. Please try again.</p>
      </div>
    );
  }

  const handlePayNow = async () => {
    setSubmitting(true);
    toast.info("Processing payment...");

    setTimeout(() => {
      toast.success("✅ Payment successful!");
      navigate(-1, {
        state: { paymentDone: true },
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastContainer />
      <div className="bg-white p-6 shadow rounded max-w-sm w-full text-center">
        {step === "method" && (
          <>
            <h2 className="text-xl font-bold mb-4">💳 Choose Payment Method</h2>
            <button
              onClick={() => {
                setPaymentMethod("upi");
                setStep("form");
              }}
              className="mb-3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
            >
              Pay via UPI
            </button>
            <button
              onClick={() => {
                setPaymentMethod("card");
                setStep("form");
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full"
            >
              Pay via Card
            </button>
          </>
        )}

        {step === "form" && (
          <>
            <h2 className="text-xl font-bold mb-4">
              {paymentMethod === "upi" ? "Enter UPI ID" : "Enter Card Details"}
            </h2>
            {paymentMethod === "upi" ? (
              <input
                type="text"
                placeholder="Your UPI ID"
                className="border p-2 rounded w-full mb-3"
                onChange={(e) => setPaymentDetails({ upiId: e.target.value })}
              />
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Card Number"
                  className="border p-2 rounded w-full mb-3"
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cardNumber: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Expiry MM/YY"
                  className="border p-2 rounded w-full mb-3"
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      expiry: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="border p-2 rounded w-full mb-3"
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cvv: e.target.value,
                    })
                  }
                />
              </>
            )}
            <button
              onClick={handlePayNow}
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
            >
              {submitting ? "Processing..." : "Pay Now"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
