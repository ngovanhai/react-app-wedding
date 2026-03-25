// Template configurations for the wedding photo album

const templates = [
  {
    id: 'template1',
    name: 'Classic Grid',
    description: 'Simple grid layout with elegant spacing',
    layout: 'grid',
    styles: {
      container: 'bg-white p-8',
      photoFrame: 'border border-gray-200 rounded-lg shadow-sm overflow-hidden',
      spacing: 'gap-4',
      titleStyle: 'text-3xl font-serif mb-2'
    }
  },
  {
    id: 'template2',
    name: 'Modern Masonry',
    description: 'Asymmetrical layout with modern feel',
    layout: 'masonry',
    styles: {
      container: 'bg-gray-50 p-6',
      photoFrame: 'rounded-xl shadow-md overflow-hidden',
      spacing: 'gap-3',
      titleStyle: 'text-4xl font-bold mb-3'
    }
  },
  {
    id: 'template3',
    name: 'Romantic Gallery',
    description: 'Centered layout with soft borders',
    layout: 'gallery',
    styles: {
      container: 'bg-pink-50 p-10',
      photoFrame: 'border-2 border-pink-200 rounded-full overflow-hidden',
      spacing: 'gap-6',
      titleStyle: 'text-3xl font-light italic mb-4'
    }
  },
  {
    id: 'template4',
    name: 'Vintage Album',
    description: 'Old-style photo album look',
    layout: 'album',
    styles: {
      container: 'bg-amber-50 p-8',
      photoFrame: 'border-4 border-amber-200 rounded bg-white p-2',
      spacing: 'gap-5',
      titleStyle: 'text-3xl font-serif italic mb-2'
    }
  },
  {
    id: 'template5',
    name: 'Minimalist',
    description: 'Clean and simple design',
    layout: 'minimal',
    styles: {
      container: 'bg-gray-100 p-6',
      photoFrame: 'rounded-none shadow-none border border-gray-300',
      spacing: 'gap-2',
      titleStyle: 'text-2xl font-sans mb-2'
    }
  }
];

module.exports = { templates };