import Link from "next/link"

type HeaderAppProps = {
    children: React.ReactNode;
}

export default function HeaderApp({ children }: HeaderAppProps) {
    return (
        <header className='f-row items-center justify-between w-full'>
            <div className='f-row gap-3 items-center'>
                <Link href='/' className='h-10 aspect-square bg-gray-a3 flex f-center rounded-md'>
            
                </Link>
                <h1 className='fw-500 text-gray-a12'>Quems</h1>
            </div>
            {children}
        </header>
    )
}