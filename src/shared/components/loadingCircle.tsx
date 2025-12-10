import { Icon } from "public-icons";

export default function LoadingCircle(props: any) {
    return (
        <div className="h-screen w-full flex f-center items-center justify-center">
            <span className="custom-spin">
                <Icon icon="loader-circle" size={32} strokeWidth={2} />
            </span>
        </div>
    )
}