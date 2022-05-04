import { React, useState, useEffect } from "react";
// eslint-disable-next-line
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  // eslint-disable-next-line
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);
  if (loading) return <p>Loading...</p>;
  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        style={{
          height: "400px",
          width: "70%",
          borderRadius: "8px",
          marginTop: "12px",
        }}
      >
        {listing.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 1000);
        }}
      >
        <ShareIcon />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name}- Rs.
          {listing.offer ? listing.offerPrice : listing.regularPrice} /-
        </p>
        <p className="listingLocation">{listing.details}</p>
        <Button variant="contained" style={{ marginRight: "8px" }}>
          For {listing.type}
        </Button>
        {listing.offer && (
          <Button variant="outlined" className="discountPrice">
            Rs.{listing.regularPrice - listing.offerPrice} discount
          </Button>
        )}
        <h2>Contact Address:</h2>
        <p className="listingLocation">{listing.address}</p>
        <a href={`mailto:${listing.mail}`}>
          <Button variant="outlined">Contact Owner</Button>
        </a>
      </div>
    </main>
  );
};

export default Listing;
