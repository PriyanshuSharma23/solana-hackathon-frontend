import { useState } from "react";
import { sendTransaction } from "./utils";

export const DisplayCard = ({ card }) => {
  const [amount, setAmount] = useState(0);

  return (
    <div>
      <h1>{card.name}</h1>
      <p>{card.description}</p>

      {card.preferred.map((price, i) => {
        return (
          <p
            key={i}
            onClick={() => {
              setAmount(Number(price));
            }}
          >
            {price}
          </p>
        );
      })}

      <input
        type="number"
        value={amount.toString()}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount(in sol)"
      />
      <button
        onClick={() => {
          sendTransaction(card.wallet, amount);
        }}
      >
        Donate
      </button>
    </div>
  );
};
