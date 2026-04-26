import Link from "next/link";

import { COMPANY_OPTIONS } from "@/lib/companies";
import type { CompanyKey } from "@/types";

export function CompanySelector({ selected }: { selected: CompanyKey }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-slate-600">Select Company</p>
      <div className="flex flex-wrap gap-2">
        {COMPANY_OPTIONS.map((company) => {
          const active = company.key == selected;
          return (
            <Link
              key={company.key}
              href={`/?company=${company.key}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                active ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {company.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
