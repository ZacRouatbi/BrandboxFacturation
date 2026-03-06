"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import Topbar from "@/components/dashboard/Topbar";
import DataTable from "@/components/dashboard/DataTable";
import FournisseurEditPanel from "@/components/fournisseurs/Fournisseureditpanel";
import FournisseurAddPanel from "@/components/fournisseurs/FournisseurAddPanel";
import { getFournisseurColumns } from "@/components/fournisseurs/Fournisseurcolumns";
import { useFournisseurs } from "@/hooks/useTier";
import { Tier } from "@/types/tier.types";
import { useEffect } from "react";
const PAGE_SIZE = 10;

export default function FournisseursPage() {
  const [page,       setPage]       = useState(1);
  const [editTarget, setEditTarget] = useState<Tier | null>(null);
  const [addOpen,    setAddOpen]    = useState(false);

  const { data, isLoading, isError,isFetching } = useFournisseurs(page, PAGE_SIZE);

  const Fournisseurs    = data?.data       ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total      = data?.total      ?? 0;

  const handleEdit      = useCallback((row: Tier) => setEditTarget(row), []);
  const handleAdd       = useCallback(() => setAddOpen(true), []);
  const handleCloseAdd = useCallback(() => {
  setAddOpen(false);
  const newTotalPages = Math.ceil((total + 1) / PAGE_SIZE);
  setPage(newTotalPages);
}, [total]);
  const handleCloseEdit = useCallback(() => setEditTarget(null), []);

  const columns = useMemo(() => getFournisseurColumns(handleEdit), [handleEdit]);


useEffect(() => {
  if (!isLoading && !isFetching && page > totalPages && totalPages > 0) {
    setTimeout(() => setPage(totalPages), 0);
  }
}, [isLoading, isFetching, page, totalPages]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar title="Fournisseurs" />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <DataTable
          title="Liste des Fournisseurs"
          subtitle={`${total} Fournisseurs enregistrés`}
          columns={columns}
          data={Fournisseurs}
          isLoading={isLoading}
          isError={isError}
          addLabel="Nouveau Fournisseur"
          onAdd={handleAdd}
          searchPlaceholder="Rechercher un Fournisseur..."
          searchKeys={["name", "mf", "phone", "address"]}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>

      <AnimatePresence>
        {addOpen && (
          <FournisseurAddPanel onClose={handleCloseAdd} />
        )}
        {editTarget && (
          <FournisseurEditPanel
            key={editTarget.id}
            Fournisseur={editTarget}
            onClose={handleCloseEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}