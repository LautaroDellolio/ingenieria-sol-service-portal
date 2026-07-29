-- Personal: mas campos de alta. Vehiculos: primer paso de su CRUD.
alter table public.profiles add column address text;
alter table public.profiles add column registered_at date not null default current_date;

alter table public.vehicles rename column description to name;
