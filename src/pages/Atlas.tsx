import { DataTable } from '@/components/DataTable'
import { Reveal } from '@/components/Motion'
import { PageHead } from '@/components/PageHead'
import { countries, refineries } from '@/lib/atlas'

export function Atlas() {
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-12">
      <PageHead
        eyebrow="The atlas"
        title="Every country, every major plant"
        standfirst={`${countries.length} refining countries and ${refineries.length} of the world’s largest individual refineries. Sort any column, filter by region or by the slate a fleet is built around, or search the notes.`}
      />
      <Reveal delay={0.05}>
        <DataTable />
      </Reveal>
    </div>
  )
}
