function CabinNotFound() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-6xl">🏔️</div>
      <h3 className="text-text mb-2 text-xl font-semibold">سوئیتی یافت نشد</h3>
      <p className="text-text-gray">
        برای این دسته‌بندی سوئیتی موجود نیست. فیلتر را تغییر دهید.
      </p>
    </div>
  );
}

export default CabinNotFound;
