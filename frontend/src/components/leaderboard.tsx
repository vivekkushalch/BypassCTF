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
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
import useGetUserDataHook from "@/hooks/useGetUserDataHook";


function Leaderboard(){
    const rowsPerPage = 10;
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(rowsPerPage);

    const {data, isLoading} = useGetUserDataHook()

    return (
        <div>
            
            {isLoading ? (
                <h1>Loading</h1>
            ) :
                (
                    <>
                    <Table>
                        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                        <TableHeader>
                            <TableRow>
                                <TableHead className="vw">Id</TableHead>
                                <TableHead>Body</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.slice(startIndex, endIndex).map((item, index) => (
                                item ?
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.id}</TableCell>
                                        <TableCell>{item.body}</TableCell>
                                    </TableRow>
                                    : <></>
                            ))}
                        </TableBody>
                    </Table>

          
            <Pagination>
                <PaginationContent>

                    <PaginationItem>
                        <PaginationPrevious
                            className={startIndex === 0 ? "pointer-events-none opacity-50" : undefined}
                            onClick={() => {
                                setStartIndex(startIndex - rowsPerPage)
                                setEndIndex(endIndex - rowsPerPage)
                            }}
                        />
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationLink
                            className={startIndex === 0 ? "pointer-events-none opacity-50" : undefined}
                            onClick={() => {
                                setStartIndex(0)
                                setEndIndex(10)
                            }}
                        >1</PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationLink
                            className={startIndex === 10 ? "pointer-events-none opacity-50" : undefined}
                            onClick={() => {
                                setStartIndex(10)
                                setEndIndex(20)
                            }}
                        >2</PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                            className={endIndex === 100 ? "pointer-events-none opacity-50" : undefined}
                            onClick={() => {
                                setStartIndex(startIndex + rowsPerPage)
                                setEndIndex(endIndex + rowsPerPage)
                            }}
                        />
                    </PaginationItem>

                </PaginationContent>
            </Pagination>
                    </>
            )}
        </div>
    )
}

export default Leaderboard