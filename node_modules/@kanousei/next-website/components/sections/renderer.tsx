type Section = { type: string; props?: any };
export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <div>
      {sections.map((s, i) => (
        <div key={i} data-section={s.type}>
          <pre>{JSON.stringify(s, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
