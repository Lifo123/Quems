'use client'
import React from "react";
import { Button, ButtonPromise } from "@lifo123/library";
import HeaderApp from "@Shared/components/HeaderApp";
import { quemsAPI } from "@Shared/services";
import { uuid } from "@lifo123/library/utils";
import { useRouter } from "next/navigation";

export default function PageCreate(props: any) {
    const [value, setValue] = React.useState('');
    const router = useRouter();

    const handleCreate = async () => {
        if (!value) return;

        const generatedId = uuid(11);
        const res = await quemsAPI.setParty({
            id: generatedId,
            name: value,
            requests: null
        })

        if (res.status === 'success' && res.state) {
            router.replace(`/req?p=${generatedId}`);
        }
    }

    return (
        <main className="tab-layer f-col w-dvw h-dvh p-6 gap-4 relative o-hidden">
            <HeaderApp >
                <>
                    {
                        value.length > 0 && (
                            <ButtonPromise
                                onPress={handleCreate}
                                className='btn btn-primary rounded-lg fs-15'
                            >
                                Create
                            </ButtonPromise>
                        )
                    }
                </>
            </HeaderApp>

            <section className="f-col gap-2 mt-3">
                <h2 className="fw-500 text-p mb-3">Create a party</h2>
                <input
                    type="text"
                    placeholder="Party name"
                    className="px-5 py-3 bg-gray-a3 border border-gray-a5 rounded-xl placeholder-gray-a10"
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                />
            </section>
        </main>
    )
}