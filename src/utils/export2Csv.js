const { Parser } = require('json2csv')

export function exportCsv(data, fields, fileName) {
  try {
    const json2csvParser = new Parser({ fields: fields, excelStrings: true })
    const csvData = json2csvParser.parse(data)
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csvData
    const link = document.createElement('a')
    link.href = encodeURI(csvContent)
    link.download = `${fileName}.csv`
    document.body.appendChild(link) // Required for FF
    link.click()
    document.body.removeChild(link) // Required for FF
  } catch (err) {
    alert(err)
  }
}
