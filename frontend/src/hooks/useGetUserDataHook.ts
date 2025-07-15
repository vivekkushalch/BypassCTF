"use client"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getUsersData = async () =>{
    try {
        // backend url
        const response = await axios.get(
            "https://jsonplaceholder.typicode.com/posts"
        );
        const data = response.data;
        // console.log(data);
        return data
    } catch (error) {
        console.log("error while fetching response : ", error);
        return []
    }
}

const useGetUserDataHook = () => {
    const usersData = useQuery({
        queryKey: ["leaderBoardData"],
        queryFn: getUsersData,
        refetchInterval: 10000
    })

    return {
        data : usersData.data, 
        isLoading : usersData.isLoading
    }
}

export default useGetUserDataHook