import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiPhotograph, HiDocumentText, HiHome, HiSparkles } from 'react-icons/hi';

type StudioMode = 'image' | 'text';

export default function Studio() {
  const [mode, setMode] = useState<StudioMode>('image');

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Left Sidebar */}
      <aside className="w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col transition-all duration-300 shadow-xl">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <Link to="/" className="flex items-center gap-3 text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-all group">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform shadow-lg">
              <HiHome className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg block">Elevator Robot</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Creative Studio</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-4">Studio Tools</p>
          <div className="space-y-2">
            <button
              onClick={() => setMode('image')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                mode === 'image'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <HiPhotograph className="w-6 h-6 flex-shrink-0" />
              <span>Image Studio</span>
              {mode === 'image' && <HiSparkles className="w-4 h-4 ml-auto" />}
            </button>
            <button
              onClick={() => setMode('text')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                mode === 'text'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <HiDocumentText className="w-6 h-6 flex-shrink-0" />
              <span>Text Studio</span>
              {mode === 'text' && <HiSparkles className="w-4 h-4 ml-auto" />}
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-cyan-200 dark:border-cyan-800">
            <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">✨ Studio Beta</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Tools are in development</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {mode === 'image' ? <ImageStudio /> : <TextStudio />}
      </main>
    </div>
  );
}

function ImageStudio() {
  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <HiPhotograph className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Image Studio</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generate images with precision control</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel: Controls */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">✨</span> Prompt
                </h2>
                <textarea
                  rows={6}
                  placeholder="Describe the image you want to create..."
                  className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 p-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:focus:border-cyan-500 dark:focus:ring-cyan-500/20 resize-none transition-all"
                />
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">🖼️</span> Base Image
                </h2>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-800/30 hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors cursor-pointer">
                  <HiPhotograph className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Coming Soon</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Upload a base image for precise control</p>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="style" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Style</label>
                    <select id="style" className="bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 block w-full p-3 transition-all">
                      <option>Realistic</option>
                      <option>Artistic</option>
                      <option>Anime</option>
                      <option>3D Render</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="size" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Size</label>
                    <select id="size" className="bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 block w-full p-3 transition-all">
                      <option>1024x1024 (Square)</option>
                      <option>1024x768 (Landscape)</option>
                      <option>768x1024 (Portrait)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="w-full text-white bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300/50 dark:focus:ring-cyan-800/50 font-bold rounded-xl text-sm px-6 py-4 text-center shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                ✨ Generate Image
              </button>
            </div>

            {/* Right Panel: Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl h-full">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">🎨</span> Preview
                </h2>
                <div className="aspect-square bg-gradient-to-br from-gray-100 via-blue-50 to-cyan-50 dark:from-gray-700/30 dark:via-gray-800/30 dark:to-gray-700/30 rounded-2xl flex items-center justify-center border border-gray-200/50 dark:border-gray-600/50 shadow-inner">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <HiPhotograph className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto" />
                      <HiSparkles className="w-8 h-8 text-cyan-400 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your generated image will appear here</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Enter a prompt and click generate to get started</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextStudio() {
  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <HiDocumentText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Text Studio</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Write better content with AI assistance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel: Input */}
            <div className="space-y-4">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <label htmlFor="content-type" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Content Type</label>
                <select id="content-type" className="bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 block w-full p-3 transition-all">
                  <option>Blog Post</option>
                  <option>Social Media Post</option>
                  <option>Article</option>
                  <option>Email</option>
                  <option>Script</option>
                </select>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">✍️</span> Topic & Instructions
                </h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Topic or subject..."
                    className="bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 block w-full p-3 transition-all"
                  />
                  <textarea
                    rows={4}
                    placeholder="Additional instructions..."
                    className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 p-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:focus:border-cyan-500 dark:focus:ring-cyan-500/20 resize-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tone" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Tone</label>
                    <select id="tone" className="bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 block w-full p-3 transition-all">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Technical</option>
                      <option>Creative</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="length" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Length</label>
                    <select id="length" className="bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 block w-full p-3 transition-all">
                      <option>Short (500 words)</option>
                      <option>Medium (1000 words)</option>
                      <option>Long (2000 words)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="w-full text-white bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300/50 dark:focus:ring-cyan-800/50 font-bold rounded-xl text-sm px-6 py-4 text-center shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                ✨ Generate Content
              </button>
            </div>

            {/* Right Panel: Output */}
            <div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl h-full flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">📝</span> Generated Content
                </h2>
                <div className="flex-1 bg-gradient-to-br from-gray-100 via-blue-50 to-cyan-50 dark:from-gray-700/30 dark:via-gray-800/30 dark:to-gray-700/30 rounded-2xl p-6 overflow-y-auto border border-gray-200/50 dark:border-gray-600/50 shadow-inner mb-4 min-h-[400px]">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <div className="relative">
                        <HiDocumentText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
                        <HiSparkles className="w-6 h-6 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your generated content will appear here</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Configure settings and click generate</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 focus:outline-none hover:bg-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200/50 dark:focus:ring-gray-700/50 font-medium rounded-xl text-sm px-5 py-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    📋 Copy
                  </button>
                  <button className="flex-1 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 focus:outline-none hover:bg-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200/50 dark:focus:ring-gray-700/50 font-medium rounded-xl text-sm px-5 py-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    💾 Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
