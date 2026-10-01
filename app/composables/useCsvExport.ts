export interface CsvColumn<T> {
  label: string
  value: (row: T) => string | number
}

const escapeCell = (value: string | number) => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

// Downloads rows as a UTF-8 CSV; the BOM makes Excel read Arabic text correctly
export const downloadCsv = <T>(filename: string, columns: CsvColumn<T>[], rows: T[]) => {
  const lines = [
    columns.map(c => escapeCell(c.label)).join(','),
    ...rows.map(row => columns.map(c => escapeCell(c.value(row))).join(','))
  ]
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
