export default function MenuHeader({ cafe }) {
  return (
    <header className="px-4 pb-6 pt-8 text-center">
      {cafe.logo ? (
        <img
          src={cafe.logo}
          alt=""
          className="mx-auto h-20 w-20 rounded-full object-cover shadow-sm"
        />
      ) : (
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-3xl">
          ☕
        </div>
      )}
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">{cafe.name}</h1>
      {cafe.description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-500">{cafe.description}</p>
      ) : null}
    </header>
  );
}
