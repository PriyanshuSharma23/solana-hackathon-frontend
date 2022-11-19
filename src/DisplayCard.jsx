import { useRef, useState } from "react";
import { BASE_URL } from "./App";
import { sendTransaction } from "./utils";
import { useMutation } from "react-query";
import { queryClient } from "./intermediate";
import { LoadingSpinner } from "./LoadingSpinner";

export const DisplayCard = ({ card }) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);

  //   const mutate = useMutation(
  //     async (data) => {
  //       await postData(data);
  //     },
  //     {
  //       onSuccess: () => {
  //         setAmount(0);
  //         //   invalidate card, totalDonos topDonations
  //         queryClient.invalidateQueries(["cards"]);
  //         queryClient.invalidateQueries(["totalDonos"]);
  //         queryClient.invalidateQueries(["topDonations"]);
  //       },
  //     }
  //   );

  if (card == null) {
    return null;
  }

  const postData = async (data) => {
    const response = await fetch(`${BASE_URL}/donate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  return (
    <div className="">
      <h1 className="text-2xl text-white pb-2">{card.name}</h1>
      <hr className="border-white/25 py-3" />
      <p className="">{card.description}</p>

      <h4 className="text-sm pt-3 pb-1 font-bold">
        Preferred Donation Amounts
      </h4>

      <div className="flex pb-4 space-x-3">
        {card.preferred_1 != null ? (
          <p
            className="badge badge-lg"
            onClick={() => {
              setAmount(Number(card.preferred_1));
            }}
          >
            {card.preferred_1}
          </p>
        ) : null}

        {card.preferred_2 != null ? (
          <p
            className="badge badge-lg"
            onClick={() => {
              setAmount(Number(card.preferred_2));
            }}
          >
            {card.preferred_2}
          </p>
        ) : null}

        {card.preferred_3 != null ? (
          <p
            className="badge badge-lg"
            onClick={() => {
              setAmount(Number(card.preferred_3));
            }}
          >
            {card.preferred_3}
          </p>
        ) : null}

        {card.preferred_4 != null ? (
          <p
            className="badge badge-lg"
            onClick={() => {
              setAmount(Number(card.preferred_4));
            }}
          >
            {card.preferred_4}
          </p>
        ) : null}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Enter amount</span>
        </label>
        <label className="input-group">
          <input
            type="text"
            placeholder="0.01"
            max={3}
            className="input input-bordered w-full font-bold"
            value={amount != 0 ? amount.toString() : ""}
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
          <button
            className="btn btn-accent"
            onClick={async () => {
              setLoading(true);
              try {
                sendTransaction(card.wallet, amount).then((tx) => {
                  console.log(tx);
                  postData(tx).then(() => {
                    window.location.reload();
                  });
                });
              } catch (e) {
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? <LoadingSpinner /> : <>Donate</>}
          </button>
        </label>
      </div>

      <div className="modal-action">
        <label
          htmlFor="my-modal"
          className="btn"
          onClick={() => {
            setAmount(0);
          }}
        >
          Close
        </label>
      </div>
    </div>
  );
};
