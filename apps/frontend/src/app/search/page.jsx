"use client";

import Search from "@/ui-pages/Search_New";
import AppLayout from "@/components/layout/AppLayout";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
  <AppLayout>
      <Search />
    </AppLayout>;
    </Suspense>
  );
  }
