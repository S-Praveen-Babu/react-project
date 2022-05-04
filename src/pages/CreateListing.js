import { React, useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {addDoc,collection,serverTimestamp} from 'firebase/firestore'

const CreateListing = () => {
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    address: "",
    details: "",
    mail:'',
    images: [],
    item: "",
    offer: true,
    offerPrice: 0,
    regularPrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const {
    type,
    name,
    address,
    details,
    item,
    offer,
    offerPrice,
    regularPrice,
    images,
    mail
  } = formData;
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
          setLoading(false)
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, [isMounted]);

  const handleSubmit =async  (e) => {
    e.preventDefault();
    // console.log(formData);
    //store images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }
    const imgUrls =await  Promise.all(
      [...images].map((image)=>storeImage(image))
    ).catch(()=>{
      setLoading(false)
      toast.error('Images are not uploaded')
      return 
    })
    console.log(imgUrls)
    const formDataCopy = {
      ...formData,imgUrls,timestamp:serverTimestamp()
    }
    delete formDataCopy.images
    const docRef = await addDoc(collection(db,'listings'),formDataCopy)
    setLoading(false);
    toast.success('Product Uploaded!')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  };
  const handleClick = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    //Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    //Text Boolean Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  if (loading) return <p>Loading ...</p>;
  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Post Your Item for Sale or Rent</p>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <label className="formLabel">Sell/Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id="type"
              value="sale"
              onClick={handleClick}
            >
              Sell
            </button>
            <button
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={handleClick}
            >
              Rent{" "}
            </button>
          </div>
          <label className="formLabel">
            Category of the Product : (Bike/Mobiles/Electronics...)
          </label>
          <input
            className="formInputName"
            type="text"
            id="item"
            value={item}
            onChange={handleClick}
            required
          />
          <label className="formLabel">Name of the Product</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={handleClick}
            required
          />
           <label className="formLabel">Contact Mail Address</label>
          <input
            className="formInputName"
            type="text"
            id="mail"
            value={mail}
            onChange={handleClick}
            required
          />
          <label className="formLabel">Details of the Product:</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="details"
            value={details}
            onChange={handleClick}
            rows="2"
            required
          />
          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              type="button"
              className={offer ? "formButtonActive" : "formButton"}
              id="offer"
              value={true}
              onClick={handleClick}
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              id="offer"
              value={false}
              onClick={handleClick}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={handleClick}
              min="50"
              max="75000000"
              required
            />
            {type === "rent" && <p className="formPriceText">  / Day</p>}
          </div>

          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="offerPrice"
                value={offerPrice}
                onChange={handleClick}
                min="50"
                max="750000000"
                required={offer}
              />
            </>
          )}
          <label className="formLabel">Address:</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={handleClick}
            rows="2"
            required
          />
          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={handleClick}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button className="primaryButton createListingButton" type="submit">
            Add Item
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
