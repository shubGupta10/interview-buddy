"use client"

import useAuthStore from '@/app/store/useAuthStore'
import React, { useEffect } from 'react'

function Dashboard() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const { user } = useAuthStore()

    useEffect(() => {
        const fetchAllCompanies = async () => {
            try {
                const response = await fetch("http://localhost:5000/company/fetch-companies", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId: user?.id })
                })
                console.log(response);
            } catch (error) {
                throw new Error("Failed to fetch companies")
            }
        }
        fetchAllCompanies()
    }, [])


    return (
        <div className='min-h-screen'>
            <div className='flex justify-center items-center p-5 text-5xl'>
                <div>Welcome to InterviewBuddy, {user?.name}</div>
            </div>

            <div>

            </div>
            <div></div>
        </div>
    )
}

export default Dashboard