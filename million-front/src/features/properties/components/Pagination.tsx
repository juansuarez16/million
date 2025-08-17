export default function Pagination({
    page, pageSize, total, onPage,
  }: { page: number; pageSize: number; total: number; onPage:(p:number)=>void; }) {
    const pages = Math.max(1, Math.ceil(total / pageSize));
    return (
      <div className="flex items-center justify-center gap-2">
        <button disabled={page<=1} onClick={()=>onPage(page-1)} className="btn">Prev</button>
        <span className="text-sm">{page} / {pages}</span>
        <button disabled={page>=pages} onClick={()=>onPage(page+1)} className="btn">Next</button>
      </div>
    );
  }
  