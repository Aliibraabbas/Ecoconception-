-- Extensions requises (gen_random_uuid)
create extension if not exists pgcrypto;

-- Fonction générique de mise à jour automatique de updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
