'use client';

import { useEffect } from 'react';
import { incrementViews } from '@/../library/actions';

export default function ViewCounter({ id }) {
  useEffect(() => {
    if (id) {
      incrementViews(id);
    }
  }, [id]);

  return null;
}
