import { Pagination as FBPagination } from "flowbite-react";

export default function Pagination({
  page, pageSize, total, onPage,
}: { page: number; pageSize: number; total: number; onPage:(p:number)=>void; }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex justify-center">
      <FBPagination
        currentPage={page}
        totalPages={pages}
        onPageChange={onPage}
        showIcons
      />
    </div>
  );
}
