import Skeleton from "../../../components/atoms/Skeleton";

const PageSkeleton = () => (
  <div className="min-h-screen bg-slate-950 p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
    <Skeleton className="h-14 w-full sm:w-2/3" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Skeleton className="h-48 lg:col-span-2" />
      <div className="space-y-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
    <Skeleton className="h-36" />
    <Skeleton className="h-64" />
    <Skeleton className="h-44" />
    <Skeleton className="h-32" />
  </div>
);

export default PageSkeleton;
