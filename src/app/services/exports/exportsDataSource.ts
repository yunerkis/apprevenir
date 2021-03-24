import { environment } from "@environments/environment";
import { getAuthHeaders, showErrorMessage } from "@services/common";

export enum ExportType {
  EndUsers = "users/all/exports",
  SystemUsers = "users/system/all/exports",
  TestResults = "users/results/all/exports",
  Clients = "clients/all/exports"
}

export enum ExportFormat {
  PDF = "pdf",
  Excel = "xlsx"
}

const reportLabelMap: { [key in ExportType]: string } = {
  [ExportType.EndUsers]: "Usuarios",
  [ExportType.Clients]: "Clientes",
  [ExportType.SystemUsers]: "Usuarios del Sistema",
  [ExportType.TestResults]: "Tests"
};

export async function generateExport(type: ExportType, format: ExportFormat): Promise<void> {
  try {
    const response = await fetch(`${environment.url}/api/v1/${type}?extend=${format}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error("Non-200 response");
    }

    // Adapted from https://stackoverflow.com/a/23797348/528131
    const blob = await response.blob();
    const filename = `Reporte ${reportLabelMap[type]}.${format}`;

    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var URL = window.URL || window.webkitURL;
      var downloadUrl = URL.createObjectURL(blob);

      // use HTML5 a[download] attribute to specify filename
      var a = document.createElement("a");
      // safari doesn't support this yet
      if (typeof a.download === 'undefined') {
        window.location.href = downloadUrl;
      } else {
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
      }

      setTimeout(() => { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
    }
  } catch (error) {
    showErrorMessage(error);
  }
}