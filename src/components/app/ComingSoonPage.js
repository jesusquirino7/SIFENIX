import PageHeader from "./PageHeader";
import EmptyState from "./EmptyState";

export default function ComingSoonPage({ title, description }) {
  return (
    <div>
      <PageHeader title={title} />
      <EmptyState title="Próximamente" description={description} />
    </div>
  );
}
