"use client";
import { postsData } from "@/app/data";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useStateContext } from "@/app/StateContext";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import {
  useGetAThread,
  useReplyThread,
  useLikeThread,
} from "../../hooks/thread-hook";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import DataLoader from "../Shared/DataLoader";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";



const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ===============================
function WriteComment() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const threadId = pathname.split("/forum/")[1].split("/")[0];
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { user } = useStateContext();
  const { addResponsee, error } =
useReplyThread();

//console.log(user)
const [userData, setUserData] = useState({
  userId: user.userId,
  content: "",
  RuserName: user.name,
  rAvatar: user.image
});


  const handleCommentChange = (e) => {
    setComment(e.target.value);
    setUserData({
      ...userData,
      ["content"]: e.target.value,
    });
    //console.log(comment)
    //console.log(userData)
  };

  const sendComment = async () => {
    try {
      console.log(userData);
      await addResponsee(threadId, userData);
      toast.success("Reply added successfully");
      await queryClient.invalidateQueries(['allThread', threadId]);
      setComment(""); 
      setIsCommentBoxOpen(!isCommentBoxOpen);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add reply");
    }
  };

  return (
    <div className="w-full">
      {!isCommentBoxOpen && (
        <button
          onClick={() => setIsCommentBoxOpen(!isCommentBoxOpen)}
          className="text-[#000] font-semibold "
        >
          Write a comment
        </button>
      )}

      {isCommentBoxOpen && (
        <div className="w-full">
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Type your comment here..."
            className="w-full p-3 min-h-32 border rounded-md focus:outline-none"
          />
          <button
            onClick={sendComment}
            className="px-7 md:px-12 py-2 md:py-3 bg-[#f29620] hover:bg-[#eba852] text-lg text-white rounded-md  transition duration-300 ease-in-out"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

// ===============================

const Post = () => {
  const { user, setUser } = useStateContext();


  const pathname = usePathname();
  const threadId = pathname.split("/forum/")[1].split("/")[0];
  const userId = user?.userId;
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState({
    userId: userId,
    threadId: threadId,
  });

  const { data, isLoading : lll ,isError } = useGetAThread(threadId);
  const { addResponse, isLoading, error } = useLikeThread();

  const handleLikeFunction = async () => {
    try {
      console.log("s");
      await addResponse(JSON.stringify(userData));
      await queryClient.invalidateQueries(['allThread', threadId]);
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error}`);
    }
  };
  if (lll) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <DataLoader />
      </div>
    );
  }
  return (
    <div className="bg-white font-normal font-poppins p-4 rounded-md">
      <h1 className=" text-[20px] sm:text-[24px] break-words md:text-2xl lg:text-3xl font-semibold mb-3 underline text-[#182822] leading-normal">
        {data?.title}
      </h1>

      <div className="flex items-center justify-start space-x-2 mb-5">
        <img
          src={data?.avatar}
          alt="janet andrews"
          className="md:w-12 md:h-12 h-9 w-9 rounded-full"
        />
        <div className="">
          <p className=" sm:text-base text-sm break-words">{data?.userName}</p>
          <p className="text-xs text-gray-500 break-words">
            {formatDate(data?.date)}
          </p>
        </div>
      </div>
      <p className="text-[#000] font-light leading-relaxed">{data?.tcontent}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex justify-start  items-center gap-5 lg:gap-10 ">
          <button
            className="flex items-center justify-center text-gray-600 "
            onClick={() => handleLikeFunction()}
          >
            <FaHeart className="text-[20px] mr-2" />
            <span className="text-[15px] font-semibold">
              {data?.likes.length}
            </span>
          </button>

          <h3 className="font-semibold -mb-1">
            {data?.replies.length > 1
              ? `${data?.replies.length} Comments`
              : `${data?.replies.length} Comment`}
          </h3>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <FaFacebookF className="text-[18px] cursor-pointer" />
          <FaLinkedinIn className="text-[18px] cursor-pointer" />
          <FaXTwitter className="text-[18px] cursor-pointer" />
        </div>
      </div>

      <div className="bg-[#e7e9e8] w-full h-[1px] mt-4"></div>

      {true && (
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <WriteComment />
          </div>

          {data?.replies.map((comment) => (
            <Comment key={comment._id} {...comment} />
          ))}
        </div>
      )}
    </div>
  );
};

const Comment = ({ RuserName, content, rAvatar, timeOfReply }) => {
  return (
    <div className="bg-gray-100 p-3 rounded-md shadow">
      <div className="flex items-center space-x-2">
        <img
          src={rAvatar}
          alt="janet andrews"
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-medium">{RuserName}</p>
          <p className="text-xs text-gray-500">{formatDate(timeOfReply)}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-normal text-[#63716c]">{content}</p>
    </div>
  );
};

const SpecificPost = () => {
  return (
    <div className="w-[90%] md:w-[80%] py-10 md:py-20 mx-auto font-poppins">
      <Post />
    </div>
  );
};

export default SpecificPost;
