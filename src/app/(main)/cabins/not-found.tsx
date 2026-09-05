import { type ReactNode } from 'react';


export default function notFound(): ReactNode {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-6xl">🏔️</div>
        <h3 className="mb-2 text-xl font-semibold text-text">
          اقامتگاهی یافت نشد
        </h3>
      </div>
  );
}
