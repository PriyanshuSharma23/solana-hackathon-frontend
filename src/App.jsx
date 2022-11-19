const BASE_URL =
  "https://3937-2409-4050-2e00-b6e6-e40d-88ac-e0a2-245f.ngrok.io";
import { useEffect } from "react";
import sol from "./assets/sol.svg";
import { useQuery } from "react-query";

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

export const App = () => {
  const cardsQuery = useQuery(["cards"], () => fetchCards());
  const totalDonosQuery = useQuery(["totalDonos"], () => fetchTotalDonos());

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

  return (
    <div className="p-4">
      <nav className="p-4 flex justify-between">
        <div className="">
          <h1 className="font-poppins text-6xl font-bold text-primary">
            RETHINK
          </h1>
          <h2 className="text-4xl font-semibold">Charity Redefined</h2>
        </div>

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
            {!totalDonosQuery.isLoading ? totalDonosQuery.data : "--"}
          </div>
        </div>
      </nav>

      <hr />

      <h2 className="pt-8 text-4xl pb-4 text-white">Top Fundraisers</h2>

      <div className="flex space-x-4 overflow-scroll">
        <Card query={cardsQuery} />
      </div>
    </div>
  );
};

const Card = ({ query }) => {
  let cards = [];
  if (query.isLoading) {
    for (let i = 0; i < 3; i++) {
      cards.push(
        <div
          key={i}
          className={`card card-compact w-96 bg-base-100 shadow-xl card-bordered animate-pulse `}
        >
          <figure className="h-[225px] bg-primary/70"></figure>
          <div className="card-body">
            <div class="flex-1 space-y-6 py-1">
              <div class="h-2 bg-primary/70 rounded"></div>
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-4">
                  <div class="h-2 bg-primary/70 rounded col-span-2"></div>
                  <div class="h-2 bg-primary/70 rounded col-span-1"></div>
                </div>
                <div class="h-2 bg-primary/70 rounded"></div>
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
            <h2 className="card-title">{card.name}</h2>
            <p>{card.description}</p>
            <div className="flex justify-between items-center">
              <progress
                className={`progress ${color} bg-gray-400  w-56 flex-shrink-0`}
                value={card.current}
                max={card.target}
              ></progress>
              <button className="btn btn-primary">Donate</button>
            </div>
          </div>
        </div>
      );
    });
  }

  return cards;
};
