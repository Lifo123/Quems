'use client';
import React from "react";
import { LayerAnimation, Pressable, PressableIcon } from "@lifo123/library";
import { $searchStore } from "../stores";
import { useStore } from "@nanostores/react";
import { formatDuration } from "@Shared/utils";

type SongItemProps = {
    isSearched?: boolean;
    [key: string]: any;
}

export default function SongItem({
    isSearched = false,
    ...props
}: SongItemProps) {
    const [isRated, setIsRated] = React.useState(false);
    const { hasSelected, selectedSong } = useStore($searchStore, { deps: ['selectedSong'] });
    const isSelected = (hasSelected && selectedSong?.id === props.id) && isSearched;

    const targetRef = React.useRef<HTMLLIElement>(null);

    return (
        <Pressable
            onPress={() => {
                if (!isSearched) return;

                if (isSelected) {
                    $searchStore.updateKey('hasSelected', false);
                    targetRef.current?.focus();
                } else {
                    $searchStore.updateKey('selectedSong', props);
                    $searchStore.updateKey('hasSelected', true);
                }
            }}
        >
            <li
                role='button'
                className='song-item f-row justify-between items-center hover:bg-gray-a3 p-2 rounded-lg pointer w-full gap-5'
                data-selected={isSelected}
                ref={targetRef}
            >
                <div className='f-row gap-3 items-center f-grow overflow-hidden'>
                    <img
                        src={props.album?.images?.[2].url || props.images?.[2].url}
                        alt={props.name ? props.name + ' image' : ''}
                        className="size-12 object-cover flex f-center no-select rounded-md o-hidden shrink-0"
                        loading="lazy"
                    />

                    <div className='f-col f-grow min-w-0'>
                        <h3 className='text-keep text-gray-12 text-p'>{props.name || 'Song name'}</h3>
                        <p className='text-p2 text-gray-11 text-keep'>
                            {
                                props.type === 'artist' ? 'Artist' :
                                    (props.type === 'album' ? 'Album  • ' : '') + props?.artists?.[0].name
                            }
                        </p>
                    </div>
                </div>

                <>
                    {
                        isSearched && props.duration_ms && <div className="flex f-center shrink-0 text-p2 text-gray-11">
                            {
                                formatDuration(props.duration_ms)
                            }
                        </div>
                    }
                    {
                        !isSearched && props.popularity > 0 && (
                            <div className="size-12 flex f-center shrink-0 text-p2 text-gray-11">
                                {
                                    props.popularity
                                }
                            </div>
                        )
                    }
                </>
            </li>
        </Pressable>
    )
}