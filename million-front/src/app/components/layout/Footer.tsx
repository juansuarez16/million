export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Million. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-slate-900" href="#">Privacy</a>
          <a className="hover:text-slate-900" href="#">Terms</a>
          <a className="hover:text-slate-900" href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}
