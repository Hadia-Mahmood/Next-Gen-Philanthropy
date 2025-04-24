"use client";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import styles from "./Contributions.module.css";
import { useStateContext } from "@/app/StateContext";
import { useGetDonorCollection } from "../../../hooks/donor-hook";

const MyCollection = () => {
  const { user } = useStateContext();

  const {
    data: donorCollection,
    isLoading: collectionLoading,
    error: collectionError,
  } = useGetDonorCollection(user?.userId);

  if (collectionLoading) return <div>Loading...</div>;
  if (collectionError)
    return <div className="text-red-500">No collection found.</div>;

  return (
    <div className="w-full bg-[#f7f9f8] min-h-screen pt-10 md:pt-8 pb-5 md:pb-10 px-3 md:px-10">
      <h1 className="font-paralucent text-[27px] md:text-3xl lg:text-4xl mt-5 mb-16 lg:w-2/4 mx-auto text-left lg:text-center text-[#182822] leading-normal">
        My NFT Collection
      </h1>

      <div className={styles.campaignContainer}>
        {donorCollection?.nfts?.map((nft) => (
          <div key={nft._id} className={styles.campaignCard}>
            <img
              src={nft.nftImage || "/default-image.jpg"}
              alt={nft.nftName}
              className={styles.campaignImage}
            />
            <div className={styles.content}>
              <h1>{nft.nftName}</h1>
              <p className="text-sm text-gray-600">
                Awarded: {nft.awardedMonth}/{nft.awardedYear}
              </p>
              <div className={styles.campaignDetails}>
                <p>
                  <strong>Description:</strong> {nft.nftDescription}
                </p>
                
              </div>

              {/*  Button opens the image URL in a new tab */}
              <button
                onClick={() => window.open(nft.nftImage, "_blank")}
                className={styles.viewButton}
              >
                View NFT
                <span className={styles.arrowIcon}>
                  <IoIosArrowRoundForward />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCollection;


