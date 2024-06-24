import React from 'react'
import { db } from "@/lib/db"
import SubjectForm from './new-subject'

export default async function page() {
    const users = await db.user.findMany()
    const transformedUsers = users.map(user => ({
        label: user.name,
        key: user.id,
    }));

    console.log(transformedUsers)
  return (
      <div>
          <SubjectForm users={transformedUsers}/>
    </div>
  )
}
