'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export type TeamMember = { id: string; email: string; role: string };
export type ProductItem = { id: string; key: string; name: string; sort_order: number };

export function teamMemberDisplay(m: TeamMember): string {
  if (!m.email) return m.id.slice(0, 8);
  const name = m.email.split('@')[0];
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : m.email;
}

export function teamMemberInitial(m: TeamMember): string {
  if (!m.email) return m.id.slice(0, 2).toUpperCase();
  const local = m.email.split('@')[0] || '';
  if (local.length >= 2) return local.slice(0, 2).toUpperCase();
  return local.toUpperCase();
}

export function useTeamMembers() {
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/team', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) {
        setUsers([]);
        return;
      }
      const json = await res.json();
      setUsers(Array.isArray(json.users) ? json.users : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, refetch: fetchUsers };
}

export function useProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        setProducts([]);
        return;
      }
      const json = await res.json();
      setProducts(Array.isArray(json.products) ? json.products : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}
