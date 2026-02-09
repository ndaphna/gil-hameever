'use client';

import './coming-soon.css';

export default function GiboraComingSoonPage() {
  return (
    <div className="launch-soon-page">
      <h1 className="launch-soon-title">השקה בקרוב</h1>
      <div className="hourglass-wrap">
        <div className="hourglass-frame">
          <div className="sand-top" aria-hidden />
          <div className="hourglass-neck" aria-hidden />
          <div className="sand-stream" aria-hidden />
          <div className="sand-bottom" aria-hidden />
        </div>
      </div>
    </div>
  );
}
