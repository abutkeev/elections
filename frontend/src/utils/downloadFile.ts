export function downloadFile(file: string, name: string) {
  const utfBOM = '\ufeff';
  const blob = new Blob([utfBOM, file], { type: 'application/octet-stream' });
  const oUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = oUrl;
  link.download = name;
  link.style.display = 'none';
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(oUrl);
}
