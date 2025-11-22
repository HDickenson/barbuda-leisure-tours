export default function TestStyles() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        Tailwind Test Page
      </h1>

      <div className="space-y-4">
        <div className="bg-blue-500 text-white p-4 rounded">
          Blue background - if you see blue, Tailwind is working
        </div>

        <div className="bg-[#32373c] text-white p-4 rounded">
          Custom color #32373c - this should be dark gray
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500 p-4 text-white">Grid 1</div>
          <div className="bg-purple-500 p-4 text-white">Grid 2</div>
        </div>

        <button className="px-6 py-3 bg-black text-white rounded hover:bg-gray-700 transition-colors">
          Hover me - color should change
        </button>
      </div>

      <div className="mt-8 p-4 border-2 border-red-500">
        <p className="text-lg">
          If you see colors, borders, spacing, and grid layout, Tailwind CSS is working correctly.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          If you only see plain black text with no colors or spacing, Tailwind is NOT working.
        </p>
      </div>
    </div>
  );
}
