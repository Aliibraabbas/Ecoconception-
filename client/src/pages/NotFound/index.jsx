import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="h-12 w-12 text-primary" aria-hidden="true" />
      <h1 className="text-3xl font-bold text-text">Page introuvable</h1>
      <p className="max-w-sm text-text-secondary">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <Link to="/">
        <Button>Retour à l’accueil</Button>
      </Link>
    </div>
  );
}
