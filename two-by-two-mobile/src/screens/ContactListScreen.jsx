import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { INVESTIGATOR_STAGES } from '../data/investigators'
import { MEMBERS } from '../data/members'
import { FAMILY, LEADERSHIP } from '../data/family'
import { MAX_CALLS_PER_DAY } from '../data/constants'

const TABS = [
  { id: 'investigators', label: 'Investigators', icon: '📖' },
  { id: 'members', label: 'Members', icon: '⛪' },
  { id: 'leadership', label: 'Leadership', icon: '🏛' },
  { id: 'family', label: 'Family', icon: '🏠' },
]

export default function ContactListScreen() {
  const [activeTab, setActiveTab] = useState('investigators')
  const [lastQuote, setLastQuote] = useState(null)

  const investigators = useGameStore((s) => s.investigators)
  const callsToday = useGameStore((s) => s.callsToday)
  const callLog = useGameStore((s) => s.callLog)
  const churchInvites = useGameStore((s) => s.churchInvites)
  const closePhone = useGameStore((s) => s.closePhone)
  const makeCall = useGameStore((s) => s.makeCall)
  const inviteToChurch = useGameStore((s) => s.inviteToChurch)

  const callsRemaining = MAX_CALLS_PER_DAY - callsToday
  const activeInvestigators = investigators.filter((i) => i.isActive)

  const handleCall = (type, id) => {
    const quote = makeCall(type, id)
    if (quote) setLastQuote(quote)
  }

  const handleInvite = (invId) => {
    inviteToChurch(invId)
    setLastQuote(null)
  }

  return (
    <div className="screen-enter phone-screen">
      {/* Header */}
      <div className="phone-header">
        <button className="btn btn-ghost" onClick={closePhone}>← Back</button>
        <h2 className="phone-title">📞 Phone</h2>
        <div className="calls-badge">
          {callsRemaining}/{MAX_CALLS_PER_DAY}
        </div>
      </div>

      {/* Tabs */}
      <div className="phone-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`phone-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setLastQuote(null) }}
          >
            <span className="phone-tab-icon">{tab.icon}</span>
            <span className="phone-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Quote bubble */}
      {lastQuote && (
        <div className="quote-bubble" onClick={() => setLastQuote(null)}>
          {lastQuote}
        </div>
      )}

      {/* Contact list */}
      <div className="phone-list">
        {activeTab === 'investigators' && (
          activeInvestigators.length === 0 ? (
            <div className="phone-empty">No active investigators yet.</div>
          ) : (
            activeInvestigators.map((inv) => {
              const called = callLog.includes(inv.id)
              const invited = churchInvites.includes(inv.id)
              return (
                <div className="contact-card" key={inv.id}>
                  <div className="contact-info">
                    <div className="contact-stage">{inv.stage}</div>
                    <div className="contact-details">
                      <div className="contact-name">{inv.name}</div>
                      <div className="contact-sub">
                        {inv.personality} · {INVESTIGATOR_STAGES[inv.stage] || 'Unknown'}
                      </div>
                      <div className="warmth-pips contact-warmth">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div key={i} className={`warmth-pip ${i < inv.warmth ? 'filled' : ''}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="contact-actions">
                    <button
                      className="call-btn"
                      disabled={called || callsRemaining <= 0}
                      onClick={() => handleCall('investigator', inv.id)}
                    >
                      {called ? '✓' : '📞'}
                    </button>
                    {inv.stage >= 3 && inv.stage < 7 && (
                      <button
                        className="call-btn invite-btn"
                        disabled={invited || callsRemaining <= 0}
                        onClick={() => handleInvite(inv.id)}
                      >
                        {invited ? '✓' : '⛪'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )
        )}

        {activeTab === 'members' && MEMBERS.map((member) => {
          const called = callLog.includes(member.id)
          return (
            <div className="contact-card" key={member.id}>
              <div className="contact-info">
                <div className="contact-icon">⛪</div>
                <div className="contact-details">
                  <div className="contact-name">{member.name}</div>
                  <div className="contact-sub">{member.role}</div>
                  <div className="contact-desc">{member.description}</div>
                </div>
              </div>
              <div className="contact-actions">
                <button
                  className="call-btn"
                  disabled={called || callsRemaining <= 0}
                  onClick={() => handleCall('member', member.id)}
                >
                  {called ? '✓' : '📞'}
                </button>
              </div>
            </div>
          )
        })}

        {activeTab === 'leadership' && LEADERSHIP.map((leader) => {
          const called = callLog.includes(leader.id)
          return (
            <div className="contact-card" key={leader.id}>
              <div className="contact-info">
                <div className="contact-icon">🏛</div>
                <div className="contact-details">
                  <div className="contact-name">{leader.name}</div>
                  <div className="contact-sub">{leader.relation}</div>
                  <div className="contact-desc">{leader.description}</div>
                </div>
              </div>
              <div className="contact-actions">
                <button
                  className="call-btn"
                  disabled={called || callsRemaining <= 0}
                  onClick={() => handleCall('leadership', leader.id)}
                >
                  {called ? '✓' : '📞'}
                </button>
              </div>
            </div>
          )
        })}

        {activeTab === 'family' && FAMILY.map((person) => {
          const called = callLog.includes(person.id)
          return (
            <div className="contact-card" key={person.id}>
              <div className="contact-info">
                <div className="contact-icon">🏠</div>
                <div className="contact-details">
                  <div className="contact-name">{person.name}</div>
                  <div className="contact-sub">{person.relation}</div>
                  <div className="contact-desc">{person.description}</div>
                </div>
              </div>
              <div className="contact-actions">
                <button
                  className="call-btn"
                  disabled={called || callsRemaining <= 0}
                  onClick={() => handleCall('family', person.id)}
                >
                  {called ? '✓' : '📞'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {callsRemaining <= 0 && (
        <div className="phone-footer">
          <div className="phone-empty">No calls remaining today.</div>
        </div>
      )}
    </div>
  )
}
