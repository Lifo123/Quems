'use client';
import React from "react";
import { Button, PressableIcon, LayerAnimation, dialog } from "@lifo123/library";


export default function ShareTab() {
    return (
        <div
            className="f-col f-center bg-gray-2 p-4 rounded-xl gap-6 min-w-xs"
        >
            <div className="f-row gap-4 items-center justify-between w-full">
                <h3 className="fw-500 text-gray-a12 text-p">Share</h3>
                <PressableIcon
                    icon='close' size={20} svgProps={{ x: .5 }}
                    className='h-9 aspect-square border border-gray-a5 rounded-lg flex f-center pointer hover:bg-gray-a3'
                    onPress={() => {
                        dialog.hide('share-tab');
                    }}
                />
            </div>

            <div className="bg-white p-4 light text-gray-12 w-full aspect-square rounded-lg flex f-center">
                item
            </div>
            <p>Share QR code</p>
        </div>
    )
}