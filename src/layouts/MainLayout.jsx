// This page intentionally drops the site's usual nav/footer chrome —
// every pixel goes to the canvas. If you want a way back to the rest
// of michaelcalle.com, add a small link inside InfoModal or Hero
// rather than reintroducing a header bar here, since a persistent
// header would eat into canvas space on every visit.
export default function MainLayout({ children }) {
  return <div className="fixed inset-0 overflow-hidden bg-neutral-900">{children}</div>;
}
