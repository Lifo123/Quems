'use client';
import React from "react";
import { Button, PressableIcon } from "@lifo123/library";
import { useRouter } from "next/navigation";
import HeaderApp from "@Shared/components/HeaderApp";

export default function PageHome() {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState('');

  const handleRouter = () => {
    const code = inputRef.current?.value;

    if (!code) {
      return console.warn('No code');
    };

    router.push("/req?p=" + code);
  }

  return (
    <main className="tab-layer f-col w-dvw h-dvh p-6 gap-4 relative o-hidden">
      <HeaderApp >
        <PressableIcon
          icon='plus' size={20} svgProps={{ x: .5 }}
          className='h-10 aspect-square border border-gray-a6 rounded-lg flex f-center pointer hover:bg-gray-a3'
          onPress={() => {
           router.replace('/create');
          }}
        />
      </HeaderApp>

      <section className="f-col gap-4 f-center mt-36">
        <h2 className="fw-500 fs-22">Join a party</h2>
        <div className="f-col gap-3 bg-gray-2 rounded-md p-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Party code"
            className="px-4 py-2.5 bg-gray-3 border-2 border-gray-5 rounded-lg fs-15"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRouter()
              }
            }}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <Button
            className='px-4 py-2 btn btn-primary rounded-lg fs-15'
            isDisabled={value.length !== 10}
            onPress={handleRouter}
          >
            Enter
          </Button>
        </div>
      </section>
    </main>
  );
}
