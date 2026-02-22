interface ProjectBriefDownloadProps {
  title: string;
  city: string;
  scope: string;
  duration: string;
  tags: string[];
}

export function ProjectBriefDownload({ title, city, scope, duration, tags }: ProjectBriefDownloadProps) {
  function downloadBrief() {
    const content = [
      `Project Brief: ${title}`,
      `City: ${city}`,
      `Duration: ${duration}`,
      `Scope: ${scope}`,
      `Tags: ${tags.join(', ')}`,
      '',
      'Prepared by [BRAND NAME] Electric',
      'Wired for Excellence',
      'Contact: (555) 123-9876',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brief.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={downloadBrief} className="inline-flex min-h-12 items-center rounded-md border border-white/25 px-6">
      Download Project Brief
    </button>
  );
}
