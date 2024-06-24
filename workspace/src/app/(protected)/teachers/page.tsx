import React from 'react'
import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { DataTable } from '@/components/table/data-table'
import { columns } from './_components/column'

export default async function Doctors() {
    const user = await currentUser()

    if (!user || !user.id) {
        notFound()
    }

    const teachers = await db.user.findMany()

    return (
        <div className="flex flex-col gap-4 flex-1 w-full">

            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Manage Doctors</h2>
                        <p className="text-muted-foreground">
                            All users registered on the platform
                        </p>
                    </div>
                </div>
                {/* @ts-ignore  */}
                <DataTable data={teachers} columns={columns} addNew='teachers' />
            </div>
        </div>
    )
}
