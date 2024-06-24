"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { FaGoogle } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { User } from "@prisma/client";
import useSelectedIdsStore from "@/hooks/use-selected-ids";

export const columns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value);
                }}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value);
                    const selectedIdsStore = useSelectedIdsStore();
                    selectedIdsStore.toggleSelectedId(row.id);
                }}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => <div className="w-[90px]">{row.getValue("email")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span>{row.getValue("name")}</span>
            </div>
        ),
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span>{row.getValue("phone")}</span>
            </div>
        ),
    },
    {
        accessorKey: "specialization",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="specialization" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span>{row.getValue("specialization")}</span>
            </div>
        ),
    },
    {
        accessorKey: "feesPerConsultation",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="fees Per Consultation" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span>{row.getValue("feesPerConsultation")}</span>
            </div>
        ),
    },
    {
        accessorKey: "experience",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="experience" />
        ),
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span>{row.getValue("experience")}</span>
            </div>
        ),
    },
];
