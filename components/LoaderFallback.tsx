import { Loader2Icon } from "lucide-react"; 

export default function LoadingFeedback({ type = "page" }: { type?: "page" | "icon" }) {
  return type === "page" ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2Icon className="animate-spin h-10 w-10 text-primary" />
    </div>
  ) : (
    <Loader2Icon className="animate-spin h-5 w-5 text-primary" />
  );
}
