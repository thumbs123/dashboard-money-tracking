export function formatRupiah(amount: number, compact = false): string {
  const num = Math.round(Number(amount) || 0);
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (compact && abs >= 1_000_000_000) {
    return `${sign}Rp${(abs / 1_000_000_000).toFixed(1)} M`;
  }
  if (compact && abs >= 1_000_000) {
    return `${sign}Rp${(abs / 1_000_000).toFixed(1)} Jt`;
  }
  if (compact && abs >= 10_000) {
    return `${sign}Rp${(abs / 1_000).toFixed(0)} Rb`;
  }

  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}Rp${formatted}`;
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${day} ${months[monthIdx] || parts[1]} ${year}`;
}

export function formatPercent(value: number): string {
  const num = Number(value) || 0;
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
}
