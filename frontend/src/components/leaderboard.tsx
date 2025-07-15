"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function Leaderboard() {
  const rowsPerPage = 10;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);

  const getData = async () => {
    try {
      // backend url
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const data = response.data;
      // console.log(data);
      return data;
    } catch (error) {
      console.log("error while fetching response : ", error);
      return [];
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["leaderBoardData"],
    queryFn: getData,
    refetchInterval: 5000,
  });

  return (
    <div className="text-sm">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Rank</TableHead>
                <TableHead className="text-xs">Player</TableHead>
                <TableHead className="text-xs">Level</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data
                ?.slice(startIndex, endIndex)
                .map((item: any, index: number) =>
                  item ? (
                    <TableRow key={index} className="h-12">
                      <TableCell className="font-medium text-xs py-2">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="text-xs py-2 truncate max-w-[100px]">
                        Player {item.id}
                      </TableCell>
                      <TableCell className="text-xs py-2">
                        {Math.floor(Math.random() * 20) + 1}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <></>
                  )
                )}
            </TableBody>
          </Table>

          <div className="mt-3">
            <div className="flex justify-center items-center gap-1">
              {/* Previous Button */}
              <button
                className={`h-8 w-8 flex items-center justify-center rounded border text-xs ${
                  startIndex === 0
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "hover:bg-blue-100 text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => {
                  if (startIndex > 0) {
                    setStartIndex(startIndex - rowsPerPage);
                    setEndIndex(endIndex - rowsPerPage);
                  }
                }}
                disabled={startIndex === 0}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              <button
                className={`h-8 w-8 flex items-center justify-center rounded border text-xs ${
                  startIndex === 0
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100 text-gray-600"
                }`}
                onClick={() => {
                  setStartIndex(0);
                  setEndIndex(10);
                }}
              >
                1
              </button>

              <button
                className={`h-8 w-8 flex items-center justify-center rounded border text-xs ${
                  startIndex === 10
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100 text-gray-600"
                }`}
                onClick={() => {
                  setStartIndex(10);
                  setEndIndex(20);
                }}
              >
                2
              </button>

              {/* Ellipsis */}
              <span className="text-gray-400 text-xs px-1">...</span>

              {/* Next Button */}
              <button
                className={`h-8 w-8 flex items-center justify-center rounded border text-xs ${
                  endIndex >= (data?.length || 0)
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "hover:bg-blue-100 text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => {
                  if (endIndex < (data?.length || 0)) {
                    setStartIndex(startIndex + rowsPerPage);
                    setEndIndex(endIndex + rowsPerPage);
                  }
                }}
                disabled={endIndex >= (data?.length || 0)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Leaderboard;
