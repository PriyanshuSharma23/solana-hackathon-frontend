export const BASE_URL = "https://solcrowd.herokuapp.com";
import sol from "./assets/sol.svg";
import phantom from "./assets/phantom-logo.svg";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { toast } from "react-toastify";
import { DisplayCard } from "./DisplayCard";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { FundRaiser } from "./CreateFundraiser";
import { ToastContainer } from "react-toastify";
window.Buffer = Buffer;

function numberShorten(num) {
  // return 2k for 2000, 2.5k for 2500, 2.5m for 2500000, 2.5b for 2500000000
  if (num < 1000) {
    return num;
  }
  if (num < 1000000) {
    return (num / 1000).toFixed(1) + "k";
  }
  if (num < 1000000000) {
    return (num / 1000000).toFixed(1) + "m";
  }
  return (num / 1000000000).toFixed(1) + "b";
}

function copyToClipboard(text) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", {
      position: "bottom-right",
      theme: "colored",
      // time 0.1s
      autoClose: 200,
      hideProgressBar: true,
    });
  }
}

async function connectSolana() {
  if (window.solana) {
    const { publicKey } = await window.solana.connect();
    return publicKey;
  }

  return null;
}

export const App = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const [publicKey, setPublicKey] = useState("");

  const cardsQuery = useQuery(["cards"], () => fetchCards());
  const totalDonosQuery = useQuery(["totalDonos"], () => fetchTotalDonos());
  const topDonationsQuery = useQuery(["topDonations"], () =>
    fetchTopDonations()
  );
  const getOrganizationQuery = useQuery(["getOrganization"], () =>
    fetchOrganization()
  );

  const fetchCards = async () => {
    console.log("fetching cards");
    const res = await fetch(`${BASE_URL}/top`);
    const data = await res.json();
    console.log(data);

    return data;
  };

  const fetchTotalDonos = async () => {
    console.log("fetching total coins donated");
    const res = await fetch(`${BASE_URL}/total`);
    const data = await res.json();
    const { total } = data;
    return total;
  };

  const fetchTopDonations = async () => {
    console.log("fetching top donations");
    const res = await fetch(`${BASE_URL}/transactions`);
    const data = await res.json();

    console.log(data);

    return data;
  };

  const fetchOrganization = async () => {
    const res = await fetch(`${BASE_URL}/organizations`);
    const data = await res.json();

    console.log(data);

    return data;
  };

  useEffect(() => {
    const x = async () => {
      const publicKey = await connectSolana();
      if (publicKey) {
        setPublicKey(publicKey);
      }
    };

    window.addEventListener("load", x);

    return () => {
      window.removeEventListener("load", x);
    };
  }, []);

  return (
    <>
      <div className="p-4">
        <nav className="p-4 flex justify-between">
          <div className="">
            <h1 className="font-poppins text-6xl font-bold text-primary">
              RETHINK
            </h1>
            <h2 className="text-4xl font-semibold">Charity Redefined</h2>
          </div>
          <div className="flex space-x-2 ">
            {publicKey === "" ? (
              <button
                className="w-max flex flex-col bg-neutral  justify-center px-4 rounded"
                onClick={async () => {
                  const publicKey = await connectSolana();
                  if (publicKey) {
                    setPublicKey(publicKey);
                  }
                }}
              >
                <div>Connect to</div>
                <div>
                  <img src={phantom} alt="phantom logo" />
                </div>
              </button>
            ) : (
              <label
                htmlFor="my-modal-3"
                className="w-max flex flex-col bg-neutral  justify-center px-4 rounded"
              >
                Create <br />
                <span className="text-xl font-bold">Fundraiser</span>
              </label>
            )}
            <div className="stat w-fit bg-neutral rounded">
              <div className="stat-figure text-secondary">
                <img
                  src={sol}
                  alt="solana"
                  className="inline-block w-8 h-8 stroke-current"
                />
              </div>
              <div className="stat-title">Total donations</div>
              <div className="stat-value text-secondary">
                {totalDonosQuery.isLoading || totalDonosQuery.isError
                  ? "--"
                  : numberShorten(totalDonosQuery.data)}
              </div>
            </div>
          </div>
        </nav>

        <hr />

        <h2 className="pt-8 text-4xl pb-4 text-white first-letter:text-purple-500 first-letter:font-semibold">
          Top Fundraisers
        </h2>

        <div className="flex space-x-4 overflow-scroll">
          <Card query={cardsQuery} setSelectedCard={setSelectedCard} />
        </div>

        <h2 className="pt-16 text-4xl pb-4 text-white first-letter:text-purple-500 first-letter:font-semibold">
          Top Donations
        </h2>

        <Table query={topDonationsQuery} />

        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <DisplayCard card={selectedCard} />
          </div>
        </div>

        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <FundRaiser publicId={publicKey} />
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

const Card = ({ query, setSelectedCard }) => {
  let cards = [];
  if (query.isLoading || query.isError) {
    for (let i = 0; i < 3; i++) {
      cards.push(
        <div
          key={i}
          className={`card card-compact w-96 bg-base-100 shadow-xl card-bordered animate-pulse `}
        >
          <figure className="h-[225px] bg-primary/70"></figure>
          <div className="card-body">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-primary/70 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-primary/70 rounded col-span-2"></div>
                  <div className="h-2 bg-primary/70 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-primary/70 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else {
    cards = query.data;

    cards = cards.map((card, i) => {
      let color = "progress-accent";

      if (card.current / card.target < 0.1) {
        color = "progress-error";
      } else if (card.current / card.target < 0.5) {
        color = "progress-warning";
      }

      return (
        <div
          key={i}
          className={`card card-compact w-96 bg-neutral shadow-xl card-bordered  flex-shrink-0`}
        >
          <figure className="h-[225px] bg-primary/70">
            <img className="object-cover" src={card.image_link} alt="" />
          </figure>
          <div className="card-body">
            <h2 className="card-title flex justify-between items-center">
              {card.name}
              <div className="text-lg flex items-center">
                {card.current}
                <img
                  src={sol}
                  alt="solana"
                  className="inline-block ml-2 w-4 h-4 stroke-current"
                />
              </div>
            </h2>
            <p>{card.description}</p>
            <div className="flex justify-between items-center">
              <progress
                className={`progress ${color} bg-gray-400  w-56 flex-shrink-0`}
                value={card.current}
                max={card.target}
              ></progress>
              {/* The button to open modal */}
              <label
                htmlFor="my-modal"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCard(card);
                }}
              >
                Donate
              </label>
            </div>
          </div>
        </div>
      );
    });
  }

  return cards;
};

const Table = ({ query }) => {
  let rows = [];

  if (query.isLoading || query.isError) {
    for (let i = 0; i < 5; i++) {
      rows.push(
        <tr key={i} className="animate-pulse">
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
        </tr>
      );
    }
  } else {
    rows = query.data;

    rows = rows.map((row, i) => {
      return (
        <tr key={i}>
          <th>{i + 1}</th>
          <td className="flex space-x-2 items-center">
            {row.amount}
            <img
              src={sol}
              alt="solana"
              className="inline-block ml-2 w-4 h-4 stroke-current"
            />
          </td>
          <td
            onClick={() => {
              copyToClipboard(row.from_wallet);
            }}
            className="max-w-[100px] text-ellipsis overflow-hidden"
          >
            {row.from_wallet}
          </td>
          <td
            onClick={() => {
              copyToClipboard(row.to_wallet);
            }}
            className="max-w-[100px] text-ellipsis overflow-hidden"
          >
            {row.to_wallet}
          </td>
          <td className="max-w-[100px] text-ellipsis overflow-hidden">
            {row.signature}
          </td>
          <td className="max-w-[100px] text-ellipsis overflow-hidden">
            {row.timestamp}
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th></th>
            <th>Amount</th>
            <th>from</th>
            <th>to</th>
            <th>signature</th>
            <th>time</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <tfoot>
          <tr>
            <th></th>
            <th>Amount</th>
            <th>from</th>
            <th>to</th>
            <th>signature</th>
            <th>time</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
