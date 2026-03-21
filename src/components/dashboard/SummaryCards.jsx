const SummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard
        title="Saldo Total"
        value={summary?.saldo}
        icon={Wallet}
        color="amber"
        trend={12.5}
      />

    <SummaryCard
  title="Total de Entradas"
  value={summary?.totalEntradas}
  icon={ArrowDownLeft}
  color="sage"
/>

<SummaryCard
  title="Total de Saídas"
  value={summary?.totalSaidas}
  icon={ArrowUpRight}
  color="terracotta"
/>
