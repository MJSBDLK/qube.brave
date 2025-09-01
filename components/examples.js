// components/examples.js

// Example components showing hybrid approach
// Component classes (.c-*) + Tailwind utilities (flex, gap-4, etc.)

export function ExampleCard({ title, children }) {
  return (
    <div className="c-card">
      <h3 className="c-heading mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export function ExampleForm() {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="c-label">First Name</label>
          <input className="c-input mt-2" placeholder="Enter first name" />
        </div>
        <div>
          <label className="c-label">Last Name</label>
          <input className="c-input mt-2" placeholder="Enter last name" />
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button type="submit" className="c-button">
          Save Changes
        </button>
        <button type="button" className="c-button c-button--secondary">
          Save Draft
        </button>
        <button type="button" className="c-button c-button--outline">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ExampleLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Your App</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export function ExampleUtilities() {
  return (
    <ExampleCard title="Utility Examples">
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-900">
          Indigo
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-900">
          Teal
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-900">
          Gold
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded bg-charcoal-100 text-charcoal-900">
          <h4 className="font-semibold mb-2">Grid Item 1</h4>
          <p className="text-sm">Using responsive grid with Tailwind utilities</p>
        </div>
        <div className="p-4 rounded bg-charcoal-100 text-charcoal-900">
          <h4 className="font-semibold mb-2">Grid Item 2</h4>
          <p className="text-sm">Combined with component classes</p>
        </div>
        <div className="p-4 rounded bg-charcoal-100 text-charcoal-900">
          <h4 className="font-semibold mb-2">Grid Item 3</h4>
          <p className="text-sm">For fast development</p>
        </div>
      </div>
    </ExampleCard>
  );
}