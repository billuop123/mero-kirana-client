import Spinner from "@/components/ui/Spinner";

export default function AuthLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  );
}
