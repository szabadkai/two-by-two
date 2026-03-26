import { useState, useCallback } from 'react'

/**
 * Objection Modal — triggered when an investigator raises a concern during teaching.
 * Player picks a response; quality affects warmth and progression.
 */
export default function ObjectionModal({ investigator, objection, onResolve }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Replace {name} in the objection text
  const firstName = investigator.name.split(' ').pop()
  const objectionText = objection.text.replace(/\{name\}/g, firstName)

  const handleChoice = useCallback((option, index) => {
    setSelectedOption({ ...option, index })
    setShowResult(true)
  }, [])

  const handleContinue = useCallback(() => {
    if (!selectedOption) return

    const qualityEffects = {
      good: { warmthDelta: 1, advance: true },
      neutral: { warmthDelta: 0, advance: true },
      weak: { warmthDelta: -1, advance: false },
    }

    const effect = qualityEffects[selectedOption.quality] || qualityEffects.neutral
    onResolve(effect)
  }, [selectedOption, onResolve])

  const qualityLabels = {
    good: { text: 'That resonated.', color: 'var(--success)' },
    neutral: { text: 'They considered it.', color: 'var(--budget)' },
    weak: { text: 'They didn\'t seem convinced.', color: 'var(--danger)' },
  }

  return (
    <div data-overlay style={styles.overlay}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span className="pixel-font" style={styles.title}>OBJECTION</span>
          <span className="pixel-font" style={styles.trigger}>{objection.trigger || 'Concern'}</span>
        </div>

        {/* Investigator concern */}
        <div style={styles.concern}>
          <div style={styles.invName}>
            <span className="pixel-font" style={styles.invNameText}>{investigator.name}</span>
            <span style={styles.invPersonality}>{investigator.personality}</span>
          </div>
          <p style={styles.concernText}>{objectionText}</p>
        </div>

        {/* Options */}
        {!showResult && (
          <div style={styles.options}>
            {objection.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(opt, i)}
                style={styles.optionBtn}
              >
                <span style={styles.optionText}>{opt.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Result */}
        {showResult && selectedOption && (
          <div className="fade-in" style={styles.result}>
            <div style={styles.yourResponse}>
              <span style={styles.responseLabel}>Your response:</span>
              <p style={styles.responseText}>"{selectedOption.text}"</p>
            </div>

            <div style={{
              ...styles.outcomeBox,
              borderColor: qualityLabels[selectedOption.quality].color,
            }}>
              <span className="pixel-font" style={{
                ...styles.outcomeText,
                color: qualityLabels[selectedOption.quality].color,
              }}>
                {qualityLabels[selectedOption.quality].text}
              </span>
              {selectedOption.quality === 'good' && (
                <span style={styles.outcomeDetail}>
                  {firstName}'s warmth increased. They want to continue learning.
                </span>
              )}
              {selectedOption.quality === 'neutral' && (
                <span style={styles.outcomeDetail}>
                  {firstName} nods slowly. They'll think about it.
                </span>
              )}
              {selectedOption.quality === 'weak' && (
                <span style={styles.outcomeDetail}>
                  {firstName} frowns. They're not ready to move forward yet.
                </span>
              )}
            </div>

            <button className="primary" onClick={handleContinue} style={styles.continueBtn}>
              <span className="pixel-font">Continue</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '16px',
  },
  container: {
    maxWidth: '500px',
    width: '100%',
    background: 'var(--panel)',
    border: '2px solid var(--border-light)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--panel-light)',
  },
  title: {
    fontSize: '11px',
    color: 'var(--danger)',
    letterSpacing: '2px',
  },
  trigger: {
    fontSize: '10px',
    color: 'var(--text-dim)',
  },
  concern: {
    padding: '16px',
    borderBottom: '1px solid var(--border)',
  },
  invName: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  invNameText: {
    fontSize: '12px',
    color: 'var(--accent-bright)',
  },
  invPersonality: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  concernText: {
    fontSize: '12px',
    color: 'var(--text)',
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '16px',
  },
  optionBtn: {
    padding: '10px 14px',
    background: 'var(--panel-light)',
    border: '1px solid var(--border-light)',
    borderRadius: '2px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.2s',
  },
  optionText: {
    fontSize: '11px',
    color: 'var(--text)',
    lineHeight: 1.5,
  },
  result: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  yourResponse: {
    padding: '10px 12px',
    background: 'var(--bg)',
    borderRadius: '2px',
    border: '1px solid var(--border)',
  },
  responseLabel: {
    fontSize: '9px',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  responseText: {
    fontSize: '11px',
    color: 'var(--accent-bright)',
    lineHeight: 1.5,
    marginTop: '4px',
    fontStyle: 'italic',
  },
  outcomeBox: {
    padding: '12px',
    borderRadius: '2px',
    border: '1px solid',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  outcomeText: {
    fontSize: '12px',
    letterSpacing: '1px',
  },
  outcomeDetail: {
    fontSize: '10px',
    color: 'var(--text-dim)',
  },
  continueBtn: {
    alignSelf: 'center',
    padding: '8px 28px',
    fontSize: '11px',
  },
}
