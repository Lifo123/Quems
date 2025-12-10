'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '@Modules/req/styles/index.css';
import { useStore } from '@nanostores/react';
import { $uiStore as UI, $partyStore } from '@Modules/req/stores';
import { Button, dialog, Dialoger, PressableIcon, Skeleton } from '@lifo123/library';
import { realtime } from '@Shared/services/realtime';
import { onValue, ref, off } from 'firebase/database';

// Components
import SearchTab from '@Modules/req/components/Tabs/SearchTab';
import ShareTab from '@Modules/req/components/Tabs/ShareTab';
import SongItem from '@Modules/req/components/SongItem';
import HeaderApp from '@Shared/components/HeaderApp';
import LoadingCircle from '@Shared/components/loadingCircle';

export default function ClientPage() {
    const params = useSearchParams();
    const router = useRouter();
    const p = params.get('p');

    const { tabs, requestedSong } = useStore(UI, { deps: ['tabs', 'requestedSong'] });
    const { name, requests } = useStore($partyStore);

    React.useEffect(() => {
        if (!p) {
            router.replace('/');
            return;
        }

        UI.updateKey('partyId', p);

        const partyRef = ref(realtime.rtdb, `parties/${p}`);

        const unsubscribe = onValue(partyRef, (snapshot) => {
            const data = snapshot.val();

            if (!data) {
                router.replace('/?e=not-found');
                return;
            }


            const requestsObj = data.requests || {};
            const requestsArr = Object.keys(requestsObj)
                .map(key => requestsObj[key])
                .sort((a: any, b: any) => {
                    const diff = (b.popularity || 0) - (a.popularity || 0);
                    if (diff !== 0) return diff;
                    return (a.name || '').localeCompare(b.name || '');
                });

            $partyStore.set({
                ...data,
                requests: requestsArr
            });
        });

        return () => {
            off(partyRef);
            unsubscribe();
        };

    }, [p, router]);

    const { myRequest, otherRequests } = React.useMemo(() => {
        if (!requests) return { myRequest: null, otherRequests: [] };

        if (requestedSong) {
            const foundMySong = requests.find((r: any) => r.id === requestedSong.id);
            const others = requests.filter((r: any) => r.id !== requestedSong.id);
            return {
                myRequest: foundMySong || requestedSong,
                otherRequests: others
            };
        }

        return { myRequest: null, otherRequests: requests };
    }, [requests, requestedSong]);

    if (!p || !requests === null) return <LoadingCircle />;

    return (
        <main className='f-col w-dvw h-dvh p-6 gap-4 relative o-hidden'>
            <Dialoger />

            <div
                className='f-col gap-4'
                data-visible={tabs.hasTabOpen}
            >
                <HeaderApp >
                    <PressableIcon
                        icon='share-2' size={20} svgProps={{ x: .5 }}
                        className='h-10 aspect-square border border-gray-a5 rounded-lg flex f-center pointer hover:bg-gray-a3 shrink-0'
                        onPress={() => {
                            dialog.custom(<ShareTab />, {
                                id: 'share-tab',
                                modalClassName: 'share-tab absolute',
                                bgColor: '#00000026'
                            })
                        }}
                    />
                </HeaderApp>

                <section className='f-col gap-4 mt-3 flex-1'>
                    <div className='f-row items-center justify-between o-hidden gap-4 shrink-0'>
                        <p className='text-nowrap o-hidden text-ellipsis'>
                            {name || 'Party name'}
                        </p>
                        <Button
                            className='btn btn-outline rounded-md'
                            onPress={() => {
                                UI.updateKey('tabs', {
                                    hasTabOpen: true,
                                    isSearchOpen: true
                                });
                            }}>
                            Request a song
                        </Button>
                    </div>

                    <div className='text-gray-11 text-p2 f-col items-center oy-auto gap-1 h-[calc(100dvh-170px)]'>
                        {myRequest && (
                            <div className="w-full mb-2 border-b border-gray-a3 pb-2.5">
                                <p className="fs-13 text-left w-full px-1 mb-1 text-primary">Your Request</p>
                                <SongItem {...myRequest} isMyRequest />
                            </div>
                        )}

                        {
                            !otherRequests ? <p className='mx-auto mt-4'>No requests</p>
                                : otherRequests.length > 0 ? (
                                    otherRequests.map((request: any) => (
                                        <SongItem key={request.id} {...request} />
                                    ))
                                ) : (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton
                                            key={i}
                                            className="rounded-lg skeleton mt-2"
                                            style={{
                                                height: 56
                                            }}
                                        />
                                    ))
                                )
                        }
                    </div>
                </section>
            </div>

            <SearchTab />
        </main>
    )
}