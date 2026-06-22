import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Input, Modal, Loader, toast } from '../components/ui';

export default function Showcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleInputValidate = () => {
    if (!inputValue.trim()) {
      setInputError('This field cannot be empty.');
    } else {
      setInputError('');
      toast.success('Input is valid!');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content py-16 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Header */}
          <div>
            <span className="section-label">Week 3 — Deliverable 2</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-3 mb-3 tracking-tight">
              Component Library Showcase
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xl">
              A live demonstration of all five reusable UI components built for the GuestVoice platform.
            </p>
          </div>

          {/* ── BUTTON ── */}
          <section id="button-showcase" className="card-base space-y-6">
            <div>
              <h2 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">Button</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Supports <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">variant</code> (primary, secondary, outline),{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">size</code> (sm, md, lg), and{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">disabled</code>.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => toast.success('Primary clicked!')}>Primary</Button>
                <Button variant="secondary" onClick={() => toast('Secondary clicked')}>Secondary</Button>
                <Button variant="outline" onClick={() => toast('Outline clicked')}>Outline</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Disabled State</p>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled Primary</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>
            </div>
          </section>

          {/* ── INPUT ── */}
          <section id="input-showcase" className="card-base space-y-6">
            <div>
              <h2 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">Input</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Supports <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">label</code>,{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">placeholder</code>,{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">type</code>,{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">value</code>,{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">onChange</code>, and{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">error</code>.
              </p>
            </div>

            <div className="space-y-4 max-w-sm">
              <Input
                label="Guest Name"
                placeholder="e.g. Priya Sharma"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setInputError(''); }}
                error={inputError}
              />
              <Input label="Email Address" type="email" placeholder="you@example.com" />
              <Input label="Password" type="password" placeholder="••••••••" />
              <Button size="sm" onClick={handleInputValidate}>Validate</Button>
            </div>
          </section>

          {/* ── MODAL ── */}
          <section id="modal-showcase" className="card-base space-y-4">
            <div>
              <h2 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">Modal</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Supports <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">isOpen</code>,{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">onClose</code>,{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">title</code>, and{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">children</code>.
                Closes on Escape key or backdrop click.
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Analysis Confirmation"
            >
              <p className="mb-4">
                You are about to submit <strong>3 guest reviews</strong> for AI sentiment analysis.
                This process may take a few seconds.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={() => { setModalOpen(false); toast.success('Analysis started!'); }}>
                  Confirm
                </Button>
              </div>
            </Modal>
          </section>

          {/* ── TOAST ── */}
          <section id="toast-showcase" className="card-base space-y-4">
            <div>
              <h2 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">Toast</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Powered by react-hot-toast. Notifications appear briefly and auto-dismiss.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => toast.success('Review analysed successfully!')}>
                Success Toast
              </Button>
              <Button variant="outline" onClick={() => toast.error('Analysis failed. Try again.')}>
                Error Toast
              </Button>
              <Button variant="secondary" onClick={() => toast('Processing your request...')}>
                Info Toast
              </Button>
            </div>
          </section>

          {/* ── LOADER ── */}
          <section id="loader-showcase" className="card-base space-y-6">
            <div>
              <h2 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">Loader</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Supports <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">size</code> (sm, md, lg) and an accessible{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded text-xs">label</code>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex flex-col items-center gap-2">
                <Loader size="sm" />
                <span className="text-xs text-slate-400">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Loader size="md" />
                <span className="text-xs text-slate-400">md</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Loader size="lg" />
                <span className="text-xs text-slate-400">lg</span>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
