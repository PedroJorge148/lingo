export default function LessonLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full w-full flex-col">{children}</div>
    </div>
  )
}
