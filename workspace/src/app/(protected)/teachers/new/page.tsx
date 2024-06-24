"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useTransition } from "react"
import { createTeacher } from "@/actions/teachers"

const daysOfWeek = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
];

const FormSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    description: z.string().min(1, { message: "Description is required." }),
    phone: z.string().min(1, { message: "Phone number is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    website: z.string().optional(),
    address: z.string().min(1, { message: "Address is required." }),
    specialization: z.string().min(1, { message: "Specialization is required." }),
    experience: z.string().min(1, { message: "Experience is required." }),
    timings: z.object({
        start: z.string().min(1, { message: "Start time is required." }),
        end: z.string().min(1, { message: "End time is required." }),
        intervals: z.array(z.string()).min(0, { message: "At least one interval is required." }),
        timeDiffrence: z.number(),
        days: z.object({
            monday: z.boolean(),
            tuesday: z.boolean(),
            wednesday: z.boolean(),
            thursday: z.boolean(),
            friday: z.boolean(),
            saturday: z.boolean(),
            sunday: z.boolean(),
        }),
    })
})



const ApplyDoctor = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            description: "",
            phone: "",
            email: "",
            website: "",
            address: "",
            specialization: "",
            experience: "",
            timings: {
                start: "",
                end: "",
                intervals: [],
                timeDiffrence: 60,
                days: {
                    monday: true,
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: false,
                    sunday: false,
                }
            },
        },
    })

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    function onSubmit(values: z.infer<typeof FormSchema>) {
        console.log(values)
        setError("");
        setSuccess("");
        startTransition(() => {
            // @ts-ignore
            createTeacher(values)
                .then((data) => {
                    if (data?.error) {
                        form.reset();
                        setError(data.error);
                    }

                    if (data?.success) {
                        form.reset();
                        setSuccess(data.success);
                    }
                })
                .catch(() => setError("Something went wrong"));
        });
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-2xl font-bold mb-4">Apply Teachers</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h4 className="text-lg font-semibold">Personal Details:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your first name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your last name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone No</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your contact number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your email address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your website" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your  address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <h4 className="text-lg font-semibold">Professional Details:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="specialization"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specialization</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your specialization" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="experience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Experience</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your experience" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1">

                        </div>
                    </div>
                    <h4 className="text-lg font-semibold">Availability:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="timings.start"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name="timings.end"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl>
                                            <input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1">
                            {daysOfWeek.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    // @ts-ignore todo:something we have to look for
                                    name={`timings.days.${item.id}` as const}
                                    render={({ field }) => (
                                        <FormItem
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    // @ts-ignore
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {item.id}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ApplyDoctor
