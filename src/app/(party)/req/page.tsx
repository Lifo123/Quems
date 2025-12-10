import { Suspense } from 'react';
import ClientPage from './clientPage'; 
import LoadingCircle from '@Shared/components/loadingCircle';

export default function Page() {
    return (
        <Suspense fallback={<LoadingCircle />}>
            <ClientPage />
        </Suspense>
    );
}