"use client"
import { useEffect } from "react";
import { FaCalendarAlt, FaCalendarCheck, FaUser } from "react-icons/fa";

export default function ClassDetail({ params }: { params: { id: string } }){
    const classId = parseInt(params.id);
    useEffect(()=>{

    },[])
    return (
        <div className="flex flex-col">
            <div className="block max-w-sm p-4 mt-2 ">
                <p></p>
            </div>
        </div>
    )
}