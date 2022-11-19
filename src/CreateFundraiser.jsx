import { BASE_URL } from "./App";
import { useRef } from "react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "./LoadingSpinner";
import { useState } from "react";

export const FundRaiser = ({ publicId }) => {
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);
  const preferred_1Ref = useRef(null);
  const preferred_2Ref = useRef(null);
  const preferred_3Ref = useRef(null);
  const preferred_4Ref = useRef(null);
  const targetRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // console.log(e.target);

    // const name = e.target.name.value;
    // const description = e.target.description.value;
    // const image_link = e.target.image_link.value;
    // const preferred_1 = e.target.preferred_1.value;
    // const preferred_2 = e.target.preferred_2.value;
    // const preferred_3 = e.target.preferred_3.value;
    // const preferred_4 = e.target.preferred_4.value;
    // const target = e.target.target.value;

    // use refs to get the values
    const name = nameRef.current.value;
    const description = descriptionRef.current.value;
    const image_link = imageRef.current.value;
    const preferred_1 = Number(preferred_1Ref.current.value);
    const preferred_2 = Number(preferred_2Ref.current.value);
    const preferred_3 = Number(preferred_3Ref.current.value);
    const preferred_4 = Number(preferred_4Ref.current.value);
    const target = targetRef.current.value;

    try {
      await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          image_link,
          preferred_1,
          preferred_2,
          preferred_3,
          preferred_4,
          target,
          wallet: publicId,
        }),
      });

      toast.success("Fundraiser created successfully");
      // reload
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };
  return (
    <div>
      <label
        htmlFor="my-modal-3"
        className="btn btn-sm btn-circle absolute right-2 top-2"
      >
        ✕
      </label>
      <h3 className="text-lg font-bold">Create Fundraiser</h3>
      <form>
        {/* name */}
        <div className="form-control">
          <label className="label" htmlFor="name">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Kitten's Paradise"
            className="input input-bordered"
            name="name"
            id="name"
            required
            ref={nameRef}
          />
        </div>

        {/* description */}
        <div className="form-control">
          <label className="label" htmlFor="description">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="
            We are a non-profit organization that rescues and rehabilitates for cute kittens
            "
            name="description"
            id="description"
            required
            ref={descriptionRef}
          ></textarea>
        </div>

        {/* image link */}
        <div className="form-control">
          <label className="label" htmlFor="image">
            <span className="label-text">Image Link</span>
          </label>
          <input
            type="text"
            placeholder="https://picsum.photos/200/300"
            className="input input-bordered"
            name="image"
            id="image"
            required
            ref={imageRef}
          />
        </div>

        {/* wallet public */}
        <div className="form-control">
          <label className="label" htmlFor="wallet">
            <span className="label-text">Public Key</span>
          </label>
          <input
            type="text"
            placeholder=""
            className="input input-bordered"
            value={publicId}
            disabled
          />
        </div>

        {/* preference donos */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Preferred Donations</span>
          </label>
          {/* four forms */}
          <div className="grid grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="0.01"
              className="input input-bordered"
              name="preferred_1"
              required
              ref={preferred_1Ref}
            />
            <input
              type="text"
              placeholder="0.01"
              className="input input-bordered"
              name="preferred_2"
              required
              ref={preferred_2Ref}
            />
            <input
              type="text"
              placeholder="0.01"
              className="input input-bordered"
              name="preferred_3"
              required
              ref={preferred_3Ref}
            />

            <input
              type="text"
              placeholder="0.01"
              className="input input-bordered"
              name="preferred_4"
              required
              ref={preferred_4Ref}
            />
          </div>
        </div>

        {/* target */}
        <div className="form-control">
          <label className="label" htmlFor="target">
            <span className="label-text">Target</span>
          </label>
          <input
            type="number"
            placeholder="1000"
            className="input input-bordered"
            name="target"
            required
            ref={targetRef}
          />
        </div>

        {/* submit button */}
        <div className="form-control pt-4">
          <button
            onClick={async (e) => {
              await handleSubmit(e);
            }}
            className="btn btn-accent"
          >
            {loading ? <LoadingSpinner /> : "Create"}
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
