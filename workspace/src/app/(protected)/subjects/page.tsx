import React from 'react'
import { db } from "@/lib/db"
export default async function page() {
    const subjects = await db.subject.findMany()
    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {subjects.map((user, i) => (
                    <li key={i}>
                        {user.name}
                        {user.code}
                    </li>
                ))}
            </ul>
        </div>
    )
}
