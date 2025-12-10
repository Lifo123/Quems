// src/components/WarmUp.tsx
'use client';
import { quemsAPI } from '@Shared/services';
import { useEffect } from 'react';

export default function WarmUpConnection() {
    useEffect(() => {
        quemsAPI.connect().then((res) => {
            if (res?.status === 'success') {
                console.log('🔥 Backend conectado (Warm Up)');
            }
        });
    }, []);

    return null;
}