'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';

/**
 * Hook to fetch invitation data by slug (public share link)
 * Replaces legacy useAlbum with SWR for data fetching
 */
export function useAlbum(shareCode) {
  const { data, error, isLoading } = useSWR(
    shareCode ? `/api/public/${shareCode}` : null,
    () => api.getPublicInvitation(shareCode)
  );

  return {
    album: data?.data || data || null,
    loading: isLoading,
    error: error?.message || null,
  };
}

/**
 * Hook to fetch invitation list for current user (dashboard)
 */
export function useInvitations() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/invitations',
    api.getInvitations
  );

  return {
    invitations: data?.data || [],
    loading: isLoading,
    error: error?.message || null,
    mutate,
  };
}
