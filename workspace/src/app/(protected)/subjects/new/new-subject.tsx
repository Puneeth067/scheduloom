"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React, { useState, useTransition } from "react"
import { createSubject } from "@/actions/subject"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk";

// Define the schema for the form
const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    code: z.string().min(2, {
        message: "Code must be at least 2 characters.",
    }),
    userIds: z.array(z.string()).nonempty({
        message: "At least one user must be selected.",
    }),
})

// Define the types for the form schema
type FormSchemaType = z.infer<typeof FormSchema>;

// Define the type for the User object
interface User {
    key: string;
    label: string;
}

// Define the props for the SubjectForm component
interface SubjectFormProps {
    users: User[];
}

export default function SubjectForm({ users }: SubjectFormProps) {
    console.log(users)
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            code: "",
            userIds: [],
        },
    })

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<User[]>(users.length > 0 ? [users[0]] : []);
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = React.useCallback((user: User) => {
        setSelected((prev) => {
            const newSelected = prev.filter((s) => s.key !== user.key);
            form.setValue("userIds", newSelected.map(s => s.key));
            return newSelected;
        });
    }, [form]);

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    if (input.key === "") {
                        setSelected((prev) => {
                            const newSelected = [...prev];
                            newSelected.pop();
                            form.setValue("userIds", newSelected.map(s => s.key));
                            return newSelected;
                        });
                    }
                }
                if (e.key === "Escape") {
                    input.blur();
                }
            }
        },
        [form]
    );

    const selectables = users.filter(
        (user) => !selected.includes(user)
    );

    function onSubmit(values: FormSchemaType) {
        console.log(values)
        setError("")
        setSuccess("")
        startTransition(() => {
            createSubject(values).then((data) => {
                setError(data.error)
                setSuccess(data.success)
            })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Mathematics" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name of the subject.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="MATH101" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the code for the subject.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="userIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Teachers</FormLabel>
                            <Command
                                onKeyDown={handleKeyDown}
                                className="overflow-visible bg-transparent"
                            >
                                <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                    <div className="flex flex-wrap gap-1">
                                        {selected.map((user) => (
                                            <Badge key={user.value} variant="secondary">
                                                {user.label}
                                                <button title="Remove"
                                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleUnselect(user);
                                                        }
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    onClick={() => handleUnselect(user)}
                                                >
                                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                </button>
                                            </Badge>
                                        ))}
                                        <CommandPrimitive.Input
                                            ref={inputRef}
                                            value={inputValue}
                                            onValueChange={setInputValue}
                                            onBlur={() => setOpen(false)}
                                            onFocus={() => setOpen(true)}
                                            placeholder="Select teachers..."
                                            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                                        />
                                    </div>
                                </div>
                                <div className="relative mt-2">
                                    <CommandList>
                                        {open && selectables.length > 0 ? (
                                            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                                <CommandGroup className="h-full overflow-auto">
                                                    {selectables.map((user) => (
                                                        <CommandItem
                                                            key={user.key}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }}
                                                            onSelect={(value) => {
                                                                setInputValue("");
                                                                const newSelected = [...selected, user];
                                                                setSelected(newSelected);
                                                                form.setValue("userIds", newSelected.map(s => s.key));
                                                            }}
                                                            className={"cursor-pointer"}
                                                        >
                                                            {user.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </div>
                                        ) : null}
                                    </CommandList>
                                </div>
                            </Command>
                            <FormDescription>
                                Select the teachers for this subject.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit"}
                </Button>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </form>
        </Form>
    )
}
