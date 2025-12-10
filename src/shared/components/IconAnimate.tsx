'use client';
import React from "react";

type IconAnimateProps = {
    children: React.ReactNode;
    isActive?: boolean;
}

export default function IconAnimate({
    children, isActive = false
}: IconAnimateProps) {
    const [state, setState] = React.useState(isActive);

    return (
        <>
            {children}
        </>
    )
}