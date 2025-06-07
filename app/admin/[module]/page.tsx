import { moduleConfigs } from "@/lib/module-config"
import { CrudTable } from "@/components/admin/crud-table"
import { notFound } from "next/navigation"

interface ModulePageProps {
  params: {
    module: string
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  const moduleConfig = moduleConfigs[params.module]

  if (!moduleConfig) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <h1 className="text-2xl font-bold text-white">{moduleConfig.name}</h1>
      <CrudTable config={moduleConfig.crudConfig} />
    </div>
  )
}
