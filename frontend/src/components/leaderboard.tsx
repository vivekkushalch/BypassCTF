"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
            <Pagination>
              <PaginationContent className="flex justify-center gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    className={`h-8 w-8 text-xs ${
                      startIndex === 0
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-blue-100"
                    }`}
                    onClick={() => {
                      setStartIndex(startIndex - rowsPerPage);
                      setEndIndex(endIndex - rowsPerPage);
                    }}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    className={`h-8 w-8 text-xs ${
                      startIndex === 0
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100"
                    }`}
                    onClick={() => {
                      setStartIndex(0);
                      setEndIndex(10);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    className={`h-8 w-8 text-xs ${
                      startIndex === 10
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100"
                    }`}
                    onClick={() => {
                      setStartIndex(10);
                      setEndIndex(20);
                    }}
                  >
                    2
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    className={`h-8 w-8 text-xs ${
                      endIndex >= data?.length
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-blue-100"
                    }`}
                    onClick={() => {
                      setStartIndex(startIndex + rowsPerPage);
                      setEndIndex(endIndex + rowsPerPage);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}

export default Leaderboard;
