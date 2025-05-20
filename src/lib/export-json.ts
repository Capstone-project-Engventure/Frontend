import exportFromJSON from 'export-from-json'

export function ExportFile(data: any[], fileName: string, exportType: "json") {
  const exportTypeMap = {
    csv: exportFromJSON.types.csv,
    xls: exportFromJSON.types.xls,
    json: exportFromJSON.types.json,
  }

  const fileNameWithExtension = `${fileName}.${exportType}`

  exportFromJSON({
    data,
    fileName: fileNameWithExtension,
    exportType: exportTypeMap[exportType],
  })
}