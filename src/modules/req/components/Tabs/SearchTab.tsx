'use client';
import React from "react";
import { useStore } from "@nanostores/react";
import { Icon } from "public-icons";
import { Button, LayerAnimation, PressableIcon, Skeleton } from "@lifo123/library";

import { $uiStore as UI, LSsearch, resetStore, $searchStore as Search, $partyStore } from "../../stores";
import SongItem from "../SongItem";
import { LSquems, quemsAPI, spotify } from "@Shared/services";

export default function SearchTab() {
    const {
        tabs, isAvailableToRequest, availableSeconds
    } = useStore(UI, { deps: ['tabs.isSearchOpen', 'isAvailableToRequest', 'availableSeconds'] });
    const {
        isSearching,
        result,
        hasSelected
    } = useStore(Search, { deps: ['result', 'hasSelected', 'isSearching'] });

    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        const cacheSearch = LSsearch.get();
        if (cacheSearch) {
            Search.updateKey('result', cacheSearch);
        }
    }, [])

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.length === 0) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return resetStore();
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            Search.updateKey('', {
                isSearching: value.length > 2,
            });

            const str = await spotify.getToken();
            if (str === '' || value.length < 3) return;

            const data = await spotify.search(value, str);
            if (!data) return;

            const formattedData = {
                artists: data.artists.items,
                tracks: data.tracks.items,
                albums: data.albums.items,
            }

            LSsearch.set(formattedData);
            Search.updateKey('', {
                isSearching: false,
                result: formattedData,
                selectedSong: null,
                hasSelected: false,
                status: 'success',
            });
        }, 500);
    }

    const handleRequest = async () => {
        if (!isAvailableToRequest) {
            console.warn('No available to request waiting 5s');
        };

        const { id } = $partyStore.get();
        const { selectedSong } = Search.get();

        if (!selectedSong) return;

        quemsAPI.requestSong(id, selectedSong);

        Search.updateKey('', {
            hasSelected: false,
            selectedSong: null,
            isSearching: false,
            status: 'idle'
        })

        UI.updateKey('', {
            isAvailableToRequest: false,
            requestedSong: selectedSong,
            availableSeconds: 5,
            tabs: {
                hasTabOpen: false,
                isSearchOpen: false,
            } as any
        });

        quemsAPI.blockRequest(5000);
    }

    return (
        <LayerAnimation
            isOpen={tabs.isSearchOpen}
            className="search-tab tab-layer h-dvh w-dvw top-0 p-6 f-col fixed bg-gray-1 outline-none border-l border-gray-a3"
            autoFocus
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    e.stopPropagation()
                    UI.updateKey('tabs', {
                        isSearchOpen: false,
                        hasTabOpen: false
                    })
                }
            }}
        >
            <section className='f-row gap-4 items-center'>
                <PressableIcon
                    aria-label='Back'
                    icon='arrow' rotate={90} size={25} svgProps={{ y: 1.5 }}
                    className='h-10 aspect-square bg-gray-a3 rounded-full flex f-center pointer'
                    onPress={() => {
                        UI.updateKey('tabs', {
                            hasTabOpen: false,
                            isSearchOpen: false
                        });
                    }}
                />
                <div className='f-row gap-3 items-center'>
                    <svg role="img" viewBox="0 0 24 24" aria-label="Spotify" height="28">
                        <title>Spotify</title>
                        <path d="M13.427.01C6.805-.253 1.224 4.902.961 11.524.698 18.147 5.853 23.728 12.476 23.99c6.622.263 12.203-4.892 12.466-11.514S20.049.272 13.427.01m5.066 17.579a.717.717 0 0 1-.977.268 14.4 14.4 0 0 0-5.138-1.747 14.4 14.4 0 0 0-5.42.263.717.717 0 0 1-.338-1.392c1.95-.474 3.955-.571 5.958-.29 2.003.282 3.903.928 5.647 1.92a.717.717 0 0 1 .268.978m1.577-3.15a.93.93 0 0 1-1.262.376 17.7 17.7 0 0 0-5.972-1.96 17.7 17.7 0 0 0-6.281.238.93.93 0 0 1-1.11-.71.93.93 0 0 1 .71-1.11 19.5 19.5 0 0 1 6.94-.262 19.5 19.5 0 0 1 6.599 2.165c.452.245.62.81.376 1.263m1.748-3.551a1.147 1.147 0 0 1-1.546.488 21.4 21.4 0 0 0-6.918-2.208 21.4 21.4 0 0 0-7.259.215 1.146 1.146 0 0 1-.456-2.246 23.7 23.7 0 0 1 8.034-.24 23.7 23.7 0 0 1 7.657 2.445c.561.292.78.984.488 1.546m13.612-.036-.832-.247c-1.67-.495-2.14-.681-2.14-1.353 0-.637.708-1.327 2.264-1.327 1.539 0 2.839.752 3.51 1.31.116.096.24.052.24-.098V6.935c0-.097-.027-.15-.098-.203-.83-.62-2.272-1.07-3.723-1.07-2.953 0-4.722 1.68-4.722 3.59 0 2.157 1.371 2.91 3.626 3.546l.973.274c1.689.478 1.998.902 1.998 1.556 0 1.097-.831 1.433-2.07 1.433-1.556 0-3.457-.911-4.35-2.025-.08-.098-.177-.053-.177.062v2.423c0 .097.01.141.08.22.743.814 2.52 1.53 4.59 1.53 2.546 0 4.456-1.485 4.456-3.784 0-1.787-1.052-2.865-3.625-3.635m10.107-1.76c-1.68 0-2.653 1.026-3.219 2.052V9.376c0-.08-.044-.124-.124-.124h-2.22c-.079 0-.123.044-.123.124V20.72c0 .08.044.124.124.124h2.22c.079 0 .123-.044.123-.124v-4.536c.566 1.025 1.521 2.034 3.237 2.034 2.264 0 3.89-1.955 3.89-4.581s-1.644-4.545-3.908-4.545m-.654 6.986c-1.185 0-2.211-1.167-2.618-2.458.407-1.362 1.344-2.405 2.618-2.405 1.211 0 2.051.92 2.051 2.423s-.84 2.44-2.051 2.44m40.633-6.826h-2.264c-.08 0-.115.017-.15.097l-2.282 5.483-2.29-5.483c-.035-.08-.07-.097-.15-.097h-3.661v-.584c0-.955.645-1.397 1.476-1.397.496 0 1.035.256 1.415.486.089.053.15-.008.115-.088l-.796-1.901a.26.26 0 0 0-.124-.133c-.389-.203-1.025-.38-1.644-.38-1.875 0-2.954 1.432-2.954 3.254v.743h-1.503c-.08 0-.124.044-.124.124v1.768c0 .08.044.124.124.124h1.503v6.668c0 .08.044.123.124.123h2.264c.08 0 .124-.044.124-.123v-6.668h1.936l2.812 6.11-1.512 3.325c-.044.098.009.142.097.142h2.414c.08 0 .116-.018.15-.097l4.997-11.355c.035-.08-.009-.141-.097-.141M54.964 9.04c-2.865 0-4.837 2.025-4.837 4.616 0 2.573 1.971 4.616 4.837 4.616 2.856 0 4.846-2.043 4.846-4.616 0-2.591-1.99-4.616-4.846-4.616m.008 7.065c-1.37 0-2.343-1.043-2.343-2.45 0-1.405.973-2.449 2.343-2.449 1.362 0 2.335 1.043 2.335 2.45 0 1.406-.973 2.45-2.335 2.45m33.541-6.334a1.24 1.24 0 0 0-.483-.471 1.4 1.4 0 0 0-.693-.17q-.384 0-.693.17a1.24 1.24 0 0 0-.484.471q-.174.302-.174.681 0 .375.174.677.175.3.484.471t.693.17.693-.17.483-.471.175-.676q0-.38-.175-.682m-.211 1.247a1 1 0 0 1-.394.39 1.15 1.15 0 0 1-.571.14 1.16 1.16 0 0 1-.576-.14 1 1 0 0 1-.391-.39 1.14 1.14 0 0 1-.14-.566q0-.316.14-.562t.391-.388.576-.14q.32 0 .57.14.253.141.395.39t.142.565q0 .312-.142.56m-19.835-5.78c-.85 0-1.468.6-1.468 1.396s.619 1.397 1.468 1.397c.866 0 1.485-.6 1.485-1.397 0-.796-.619-1.397-1.485-1.397m19.329 5.19a.31.31 0 0 0 .134-.262q0-.168-.132-.266-.132-.099-.381-.099h-.588v1.229h.284v-.489h.154l.374.489h.35l-.41-.518a.5.5 0 0 0 .215-.084m-.424-.109h-.26v-.3h.27q.12 0 .184.036a.12.12 0 0 1 .065.116.12.12 0 0 1-.067.111.4.4 0 0 1-.192.037M69.607 9.252h-2.263c-.08 0-.124.044-.124.124v8.56c0 .08.044.123.124.123h2.263c.08 0 .124-.044.124-.123v-8.56c0-.08-.044-.124-.124-.124m-3.333 6.605a2.1 2.1 0 0 1-1.053.257c-.725 0-1.185-.425-1.185-1.362v-3.484h2.211c.08 0 .124-.044.124-.124V9.376c0-.08-.044-.124-.124-.124h-2.21V6.944c0-.097-.063-.15-.15-.08l-3.954 3.113c-.053.044-.07.088-.07.16v1.007c0 .08.044.124.123.124h1.539v3.855c0 2.087 1.203 3.06 2.918 3.06.743 0 1.46-.194 1.884-.442.062-.035.07-.07.07-.133v-1.68c0-.088-.044-.115-.123-.07" transform="translate(-0.95,0)" fill='#1ed760' />
                    </svg>
                    <h2 className='fw-500 text-gray-a12'>Search by Spotify</h2>
                </div>
            </section>

            <section className=' f-col gap-5 mt-6 flex-1 o-hidden'>
                <div className='f-row gap-2 relative shrink-0'>
                    <input
                        type="text"
                        placeholder='Search...'
                        className='px-5 py-3 bg-gray-a3 border border-gray-a5 rounded-full placeholder-gray-a10 w-full'
                        onChange={handleChange}
                    />
                    <span className='absolute right-3 h-8 aspect-square top-1/2 -translate-y-1/2 rounded-full overflow-hidden'>
                        <div className="icon-stack">
                            <span
                                className="icon-swap flex f-center"
                                data-active={!isSearching}
                            >
                                <Icon icon='search' size={20} />
                            </span>

                            <span
                                className="icon-swap flex f-center"
                                data-active={isSearching}
                            >
                                <span className="custom-spin flex">
                                    <Icon icon='loader-circle' size={18} strokeWidth={2.5} />
                                </span>
                            </span>
                        </div>
                    </span>
                </div>

                <div className="f-col gap-1 flex-1 oy-auto">
                    {
                        result ? (
                            <>
                                {
                                    result.tracks?.map((track: any, i: number) => (
                                        <SongItem key={i} {...track} isSearched />
                                    ))
                                }

                                {result?.artists![0] && <SongItem {...result.artists![0]} isSearched />}
                                {result?.artists![1] && <SongItem {...result.artists![1]} isSearched />}

                                {result?.albums![0] && <SongItem {...result.albums![0]} isSearched />}
                                {result?.albums![1] && <SongItem {...result.albums![1]} isSearched />}
                            </>
                        ) : (
                            isSearching && (
                                <div className="f-col gap-3">
                                    {
                                        Array.from({ length: 6 }).map((_, i) => (
                                            <Skeleton
                                                key={i}
                                                className="rounded-lg skeleton"
                                                style={{
                                                    height: 56
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                            )
                        )
                    }
                    {/* {
                        result && (
                            <Button
                                className="btn btn-outline rounded-full fs-13 py-2 shrink-0 mt-4 mx-auto w-max px-5 border-gray-5 text-gray-11"
                            >
                                Delete history
                            </Button>
                        )
                    } */}
                </div>
            </section>

            <section
                className='w-full h-max flex f-center mt-auto shrink-0 pt-6 bg-gray-1'
            >
                <Button
                    isDisabled={!hasSelected || !isAvailableToRequest}
                    className='py-3 btn btn-primary rounded-xl w-full fs-15 fw-600'
                    onPress={handleRequest}

                >
                    {!isAvailableToRequest ? `Request in ${availableSeconds}s` : 'Request'}
                </Button>
            </section>
        </LayerAnimation>
    )
}
