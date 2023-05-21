import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import Head from "next/head";

import { api } from "~/utils/api";
import router from "next/router";

type JoinHouseholdForm = {
    code: string;
}

const JoinHousehold: NextPage = () => {

    const joinHousehold = api.households.joinHousehold.useMutation();
    const {user} = useUser();

    const { register, handleSubmit } = useForm<JoinHouseholdForm>();
    const onSubmit = (formData: JoinHouseholdForm) => {
        console.log(formData)

        const fullName = (user?.firstName || '') + ' ' + (user?.lastName || '');

        joinHousehold.mutateAsync({
            code: formData.code,
            memberName: fullName,
        }).catch(err => {
            console.error(err);
        });
        router.back();
    };



    return (
        <>
        <Head>
            <title>Join an existing household</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex min-h-screen flex-col items-center bg-gray-800">
            <h1 className="text-4xl pb-12 pt-16">Join an existing household</h1>
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 text-white">Enter in household code</label>
                        <input {...register("code", { required: true })} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required/>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Join</button>

                  
                </form>
            </div>
        </main>
        </>
    );
};

export default JoinHousehold;
