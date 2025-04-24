"use client";
import React, { useState ,useEffect } from "react";
import '../../../index.css';
import { useCreateThread , useGetAllThreads } from "../../../hooks/thread-hook";
import { useStateContext } from "@/app/StateContext";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import Likes from "@/utils/Likes";
import Comments from "@/utils/Comments";


const Page = () => {
    const [thread, setThread] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [threadList, setThreadList] = useState([]);
    const { user, setUser } = useStateContext();


    const [userData, setUserData] = useState({
        userId: user?._id,
        title: "",
      });
      
      const { mutate: addMutate } = useCreateThread(JSON.stringify(userData));
      const { data, isError } = useGetAllThreads();

      useEffect(() => {
        const checkUser = () => {
          setThreadList(data);
        };
        checkUser();
    }, [data]);
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData({
          ...userData,
          [name]: value,
        });
        console.log(userData.title)
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        addMutate(
          {},
          {
            onSuccess: (response) => {
              console.log(response)
              toast.success(response?.data?.message);
              setThreadList(response?.data?.threads);
              setIsLoading(false);
            },
            onError: (response) => {
              console.error("An error occurred:");
              console.log(response);
              console.log(response.response.data.message);
              toast.error(response.response.data.message);
              setIsLoading(false);
            },
          }
        );
      };
    
    return (
        <>
            <main className='home'>
                <h2 className='homeTitle'>Create a Thread</h2>
                <form className='homeForm' onSubmit={handleSubmit}>
                    <div className='home__container'>
                        <label htmlFor='thread'>Title / Description</label>
                        <input
                            type='text'
                            name='title'
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    {isLoading ? (
                  <FaSpinner className="animate-spin" /> // Show spinner if isLoading is true
                ) : (
                    <button className='homeBtn'>CREATE THREAD</button>
                )}
                    
                </form>

                <div className='thread__container'>
                {threadList?.map((thread) => (
                    <div className='thread__item' key={thread._id}>
                        <p>{thread.title}</p>
                        <div className='react__container'>
                            <Likes numberOfLikes={thread.likes.length} threadId={thread._id} />
                            <Comments
                                numberOfComments={thread.replies.length}
                                threadId={thread._id}
                            />
                        </div>
                    </div>
                ))}
            </div>
            </main>
        </>
    );
};

export default Page;