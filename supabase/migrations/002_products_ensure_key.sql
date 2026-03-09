-- Pastikan tabel products punya kolom slug (dan code jika dipakai). Jalankan sekali di Supabase SQL Editor.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'key') THEN
    ALTER TABLE public.products RENAME COLUMN key TO slug;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'product_key') THEN
    ALTER TABLE public.products RENAME COLUMN product_key TO slug;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'slug') THEN
    ALTER TABLE public.products ADD COLUMN slug text UNIQUE;
    UPDATE public.products SET slug = coalesce(lower(regexp_replace(replace(name, ' ', '_'), '[^a-z0-9_]', '', 'g')), 'p-' || id::text) WHERE slug IS NULL OR slug = '';
    ALTER TABLE public.products ALTER COLUMN slug SET NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'name') THEN
    ALTER TABLE public.products ADD COLUMN name text NOT NULL DEFAULT 'Produk';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'sort_order') THEN
    ALTER TABLE public.products ADD COLUMN sort_order int NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'code') THEN
    ALTER TABLE public.products ADD COLUMN code text;
    UPDATE public.products SET code = slug WHERE slug IS NOT NULL;
    ALTER TABLE public.products ALTER COLUMN code SET NOT NULL;
  END IF;
END $$;
NOTIFY pgrst, 'reload schema';
